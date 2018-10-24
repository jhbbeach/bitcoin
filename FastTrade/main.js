'use babel';
// if (require('electron-squirrel-startup')) return;
const electron = require('electron');
require('electron-debug')({showDevTools: false});
//const session = require('electron');
//const electronCookies = require('electron-cookies');
const maObj = require('getmac');
// const crypto = require('crypto');
const ip = require('ip');
const fs = require("fs");
const app = electron.app;
const pathGen = require('path');
const MainWindow = require('./windows/MainWindow');
const WSReport = require('./windows/WSReport');
const exec = require('child_process').exec;

const BrowserWindow = electron.BrowserWindow;
const winston = require('winston');
// const logger = new (winston.Logger)({
//     transports: [
//         new (winston.transports.Console)(),
//         new (winston.transports.File)({filename: '../config/project.log',timestamp: function() {
//             let time = new Date();
//             return time.toLocaleString();
//           }})
//     ]
// });
//主进程
const ipc = require('electron').ipcMain;
var count = 0, random = Math.floor(Math.random() * 100);  //多窗口打开的个数，以便确定窗口位置
global.sharedObject = {
    someProperty: 'default value',
    simulateOrder: ''
};

global.layoutData = "";

let allWindowsInfos = [];   //用于保存当前的已经打开的窗口信息结构[{contentName:"",title:"",windowId:""}]
let moveType = "";
let menuWinWindowIds = [];//下拉菜单窗口ID数组
let layoutWindowsId = [];//存储需要布局的窗口的ID
let layoutWindowsContentName = [];//存储需要布局的窗口的contentName

var mainWindow = null;
var wsReport = null;
var isDeveloper = null;

//响应窗口标题栏
ipc.on("updateWidowsInfo", function (e, arg) {
    let needUpdateWidow = allWindowsInfos.filter((item)=> {
        return (item.windowId === arg.windowId)
    })[0];
    if (needUpdateWidow) {
        needUpdateWidow.title = arg.title;
    }
    for (let windowInfo of allWindowsInfos) {
        let window = BrowserWindow.fromId(windowInfo.windowId);
        if (arg.windowId === windowInfo.windowId) {
            window.setTitle(arg.title);
        }
        if (window) {
            window.send("updateAllWidowsInfos", allWindowsInfos);
        }
    }
});

/*
 * 外部文件获取项目服务地址
 */
let path = app.getAppPath();
let resourcePath = path.substr(0, path.lastIndexOf('\\'));
var iniData = [];
var updateAddress;
var serverAddress;
var port;
var projectAddress;
var password;

fs.readFile(pathGen.join(path, '../config/config.ini'), 'utf-8', function (err, data) {
    if (err) {
        isDeveloper = true;
        //console.log("错了"+err);
        global.frameworkConfig = {
            domain: 'http://192.168.201.155:8080',
            wsdomain:'ws://192.168.201.155:8080',
            projectName: 'option'
        };
        updateAddress = 'http://192.168.101.164:9999/latest';
        // serverAddress = '192.168.101.164';
        // port = '22';
        // projectAddress = 'trade';
        // password = 'trade';
    } else {
        isDeveloper = false;
        iniData = data.split("=");
        console.log("对的" + iniData[8]);
        global.frameworkConfig = {
            domain: iniData[1].substr(0, iniData[1].indexOf(";")).trim(),
            wsdomain: iniData[2].substr(0, iniData[2].indexOf(";")).trim(),
            projectName: iniData[3].substr(0, iniData[3].indexOf(";")).trim()
        };
        updateAddress = iniData[4].substr(0, iniData[4].indexOf(";")).trim();
        if(iniData[5]){
            serverAddress = iniData[5].substr(0, iniData[5].indexOf(";")).trim();
            port = iniData[6].substr(0, iniData[6].indexOf(";")).trim();
            projectAddress = iniData[7].substr(0, iniData[7].indexOf(";")).trim();
            password = iniData[8].substr(0, iniData[8].indexOf(";")).trim();
        }
    }
});




/**
 * 生成每个串口要加载的URL
 * contentName 为要加载页面名字,windowId为窗口id,title:为标题名,layoutId为布局id,style为启动模式
 */

var _creatLoadURL = function (contentName, id, title, layoutId, style) {
    //分页加载url
    return ('file://' + __dirname + '/dispersePages/' + contentName + '.html' + '?windowId=' + id + "&title=" + title + "&layoutId=" + layoutId + "&style=" + style);

    //作为统一app加载
    // return( 'file://' + __dirname + '/pages-react/index.html#/'+contentName+'?windowId=' +id+"&title="+title+"&layoutId="+layoutId+"&style="+style);

}

/**
 * 关闭窗口必须回调的代码 用于删除allWindowsInfos中的记录
 */

var _deleteWindowsInfo = function (windowId) {
    let result = allWindowsInfos.filter((item)=> {
        return (item.windowId === windowId)
    })[0];
    if (result) {
        let index = allWindowsInfos.indexOf(result);
        if (index >= 0) {
            allWindowsInfos.splice(index, 1);
            for (let windowInfo of allWindowsInfos) {
                let window = BrowserWindow.fromId(windowInfo.windowId);
                if (window) {
                    window.send("updateAllWidowsInfos", allWindowsInfos);
                }
            }
        }
    }
}

/**
 * 统一窗口生成定制函数
 * arg 参数必须包含{style:string,unique:bool}这两个字段,,其中style 可选类型"clone",""nomal","layout"三种分别代表克隆生成 正常生成,布局生成
 * unique表示此窗口是否是单例 是否唯一
 */

var _creatWindow = function (e, arg, originFrame, originTitle, contentName, originWindowRef) {
    let x = originFrame.x;
    let y = originFrame.y;
    let width = originFrame.width;
    let height = originFrame.height;
    let title = originTitle;

    if (arg && arg.style === "nomal") {
        if (arg.layoutId) {
        } else {
            arg.layoutId = "-9999";
        }

    } else if (arg && arg.style === "clone") {
        title = arg.title;
        if (arg.layoutId) {
        } else {
            arg.layoutId = "-9999";
        }
    } else if (arg && arg.style === "layout") {
        x = arg.x;
        y = arg.y;
       // style = "layout";
        width = arg.width;
        height = arg.height;
        title = arg.winTitle;
    }

    let config = {
        x: x,
        y: y,
        resizable: true,
        maximizable: true,
        height: height,
        width: width,
        title: title,
        frame: false,
        center:true,
        backgroundColor: "#181c26",
        acceptFirstMouse:true
    }
    if (isNaN(config.x)){
        delete config.x;
    }
    if (isNaN(config.y)){
        delete config.y;
    }
    let newWindow = null;
    if (arg.unique) {
        newWindow = originWindowRef;
    }
    if (newWindow == null) {
        newWindow = new BrowserWindow(config);
        layoutWindowsId.push(newWindow.id);
        layoutWindowsContentName.push(contentName);
        if (arg != undefined && arg != "undefined" && arg != null) {
            let url = _creatLoadURL(contentName, newWindow.id, title, arg.layoutId, arg.style);
            newWindow.loadURL(url);
        } else {
            //newWindow.loadURL('file://' + __dirname + '/pages-react/index.html#/'+contentName+'?id=' + newWindow.id+"&title="+title);
        }
        newWindow.setMenu(null);
        allWindowsInfos.push({contentName: contentName, title: title, windowId: newWindow.id})
        newWindow.on("page-title-updated", function (event) {
            newWindow.send("updateAllWidowsInfos", allWindowsInfos);
            event.preventDefault();
        });
    }
    newWindow.focus();
    return newWindow;
}

app.on('ready', () => {
    maObj.getMac(function (err, macAddress) {
        mainWindow = new MainWindow(macAddress,serverAddress);
        wsReport = new WSReport(mainWindow);
    });
});

app.on('before-quit', function () {
    if(wsReport !== null){
        mainWindow = null;
        wsReport.setMainWindow(mainWindow);
    }
});

app.on('certificate-error', function (event, webContents, url, error, certificate, callback) {
    event.preventDefault();
    callback(true);
});

// ipc.on("console", function (e, arg) {
//     logger.log(arg.level, arg.content);
// });

/**
 * 窗口控制
 */
ipc.on("windowControl", function (e, messageType, windowId,marketMaker) {
    if (windowId) {
        let currentWindow = BrowserWindow.fromId(windowId);
        if (currentWindow !== null) {
            switch (messageType) {
                case 1:
                    //最小价
                    if (!currentWindow.isMinimized()) {
                        currentWindow.minimize();
                        if(currentWindow.getTitle() && currentWindow.getTitle() == "主页面"){
                            for(let value of layoutWindowsId){
                                let otherWindow = BrowserWindow.fromId(value);
                                if(otherWindow){
                                    otherWindow.minimize();
                                }
                            }
                            if(menuWindow)
                                menuWindow.hide();
                        }
                    }
                    console.log(windowId)
                    console.log(layoutWindowsId);
                    break;
                case 2:
                    //最大化
                    if (!currentWindow.isMaximized()) {
                        winW=electron.screen.getPrimaryDisplay().workAreaSize.width;
                        winH=electron.screen.getPrimaryDisplay().workAreaSize.height;
                        currentWindow.setBounds({
                            x: 0, 
                            y: 70, 
                            width: winW, 
                            height: winH-70
                        });
                        if(marketMaker){
                            currentWindow.send("changeHeight",winH-60)
                        }
                    }
                    break;
                case 3:
                    for (let i = 0; i < layoutWindowsId.length; i++) {
                        if (windowId == layoutWindowsId[i]) {
                            layoutWindowsId.splice(i, 1);
                            layoutWindowsContentName.splice(i, 1);
                        }
                    }
                    //关闭
                    currentWindow.close();
                    currentWindow = null;
                    break;
                case 4:
                    //显示
                    currentWindow.show();
            }
        }
    }
});

/**
 * 弹出菜单
 */
var menuWindow = null;
ipc.on("openMenu", function (e, arg) {
    if (menuWindow == null) {
        menuWindow = new BrowserWindow({
            resizable: false,
            maximizable: true,
            x: 0,
            y: 70,
            width: 137,
            height: arg,
            frame: false,
            movable: false,
            backgroundColor: "#181c26",
            title: "子菜单",
            show: false,
        });
        let url = _creatLoadURL("Menu", menuWindow.id, "", "-9999", "nomal");
        menuWindow.loadURL(url);
        menuWindow.setMenu(null);
        menuWindow.once('ready-to-show', () => {
            menuWindow.show()
        })
    } else {
        //判断窗口是否可见，true可见
        if (menuWindow.isVisible()) {
            menuWindow.hide();
        } else {
            menuWindow.show();
        }
    }
    menuWindow.on("closed", function () {
        menuWindow = null;
    })
    menuWindow.on("blur", function () {
        menuWindow.hide();
    })
});

/**
 * 交易页面
 */
var tradePageWindow = null;
ipc.on("tradePage", function (e, arg) {
    if (tradePageWindow == null) {
        tradePageWindow = new BrowserWindow({
            resizable: true,
            maximizable: true,
            // x: 200,
            // y: 70,
            width: 1230,
            height: 700,
            title: "交易面板",
            frame: false,
            center:true,
            backgroundColor: "#181c26",
            acceptFirstMouse: true,
        });
        let url = _creatLoadURL("tradePage", tradePageWindow.id, "交易面板", "-9999", "nomal");
        tradePageWindow.loadURL(url);
        tradePageWindow.setMenu(null);
        mainWindow.hide();
        let myNotification = new Notification('标题', {
            body: '通知正文内容'
          })
          myNotification.onclick = () => {
            console.log('通知被点击')
          }
    }else{
        tradePageWindow.focus();
    }
    tradePageWindow.on("closed", function () {
        tradePageWindow = null;
        mainWindow.close();
    })
});
