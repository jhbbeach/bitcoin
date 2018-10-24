/**
 * 主页面
 */
'use strict';
const { BrowserWindow } = require('electron');
const electron = require('electron');
const app = electron.app;
const ip = require('ip');
const BuildWindowFunc = require('./util/BuildWindowFunc');
class MainWindow {
    constructor(macAddress) {
        this.mainWindow = null;
        this.createMainWindow(macAddress);
    }

    createMainWindow(macAddress) {
        this.mainWindow = new BrowserWindow({
            resizable:false,
            width: 330,
            height: 410,
            title: "登录",
            backgroundColor: "#181c26",
            center: true,
            frame: false,
            show: false
        });
        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow.show()
        });
        let url = BuildWindowFunc.createUrl("Login", this.mainWindow.id, {macAddress: macAddress, ip:ip.address()});
        this.mainWindow.loadURL(url);
        this.mainWindow.on("closed", function () {
            this.mainWindow = null;
            app.quit();
        });
    }

    getWindow(){
        return this.mainWindow;
    }

    show() {
        if (!this.mainWindow) {
            this.createMainWindow();
        } else {
            this.mainWindow.show();
        }
    }

    focus(){
        this.mainWindow.focus();
    }

    hide() {
        this.mainWindow.hide();
    }

    close() {
        this.mainWindow.close();
    }

}

module.exports = MainWindow;