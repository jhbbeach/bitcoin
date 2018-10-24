"use strict"
const electron = window.require('electron');
const {ipcRenderer} = electron;
var console ={}
/**
 *  日志
 * @param level
 * @param content
 */
console.log = function(content){
    ipcRenderer.send("console",{level:"info",content:content});
}
/**
 *  错误
 * @param level
 * @param content
 */
console.error = function(content){
    ipcRenderer.send("console",{level:"error",content:content});
}
/**
 *  信息
 * @param level
 * @param content
 */
console.info = function(content){
    ipcRenderer.send("console",{level:"info",content:content});
}
/**
 *  警告
 * @param level
 * @param content
 */
console.warn = function(content){
    ipcRenderer.send("console",{level:"warn",content:content});
}
/**
 *  漏洞
 * @param level
 * @param content
 */
console.debug = function(content){
    ipcRenderer.send("console",{level:"info",content:content});
}
export default console