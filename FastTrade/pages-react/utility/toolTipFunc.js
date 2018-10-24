/**
 * Created by DB on 2016/12/13.
 */
'use strict';
const electron = window.require('electron');
const {ipcRenderer} = electron;
import toolTip from '../components/tooltip/tooltip'

var ToolTipFunc = {
    /**
     * 弹出系统提示
     */

    rightBorderNotice(msgs) {
        var msgInfo = {msg:msgs}
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


export default ToolTipFunc;
