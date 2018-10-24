/**
 * Created by chenxi on 2016/11/2.
 */
'use strict';
const electron = window.require('electron');
const {ipcRenderer} = electron;
  // 本地交易单号处理
global.creatOrderNum = function(){
    let logonInfo ={}
    try{ logonInfo = JSON.parse(window.localStorage.logonInfo);}catch(error) {}
    let oldMaxOrderLocalID = logonInfo.maxOrderLocalID;
    let id = parseInt(oldMaxOrderLocalID);
    if (isNaN(id) || id == null || id == 0){
        id = 1;
    } else {
        id = id + 1;
    }

    let maxOrderLocalID = id.toString();
    logonInfo.maxOrderLocalID = maxOrderLocalID;
    if (maxOrderLocalID.length != 12){
        let str = '';
        for (let i = maxOrderLocalID.length; i < 12; i++){
            str = str + "0";
        }
        maxOrderLocalID = str + maxOrderLocalID;
        logonInfo.maxOrderLocalID = maxOrderLocalID;
    }
    let localStorage = window.localStorage;
    localStorage.setItem("logonInfo",JSON.stringify(logonInfo));
    return maxOrderLocalID;
}

global.ToolTipFunc =  {
    /**
     * 弹出系统提示
     */
    rightBorderNotice(msgInfo) {

        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac){
            var notification = new Notification("提示：", {
                body: msgInfo.msg,
            });
            notification.onshow = function() { setTimeout(notification.close, 15000) };
            notification.onclick = function() {
                msgInfo.clickFunc();
            };
        }
        if (isWin) {
            var isWin2003 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin2003){
                let obj = {msg:msgInfo.msg,clickFlag:msgInfo.clickFlag}
                ipcRenderer.send("tooltip",obj);
            }else{
                var notification = new Notification(msgInfo.msg);
                notification.onshow = function() { setTimeout(notification.close, 15000) };
                notification.onclick = function() {
                    msgInfo.clickFunc();
                };
            }
        }

    }
};

