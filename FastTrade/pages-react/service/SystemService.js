'use strict';

var SystemService = {};

SystemService.constant = {
    MAC: 'mac',
    UNIX: 'unix',
    LINUX: 'linux',
    WIN2000: 'win2000',
    WIN2003: 'win2003',
    WINVISTA: 'winVista',
    WINXP:'winXP',
    WIN7: 'win7',
    WINDOWS : 'windows'
};


SystemService.getSystemType = function(){
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isMac) return SystemService.constant.MAC;
    if (isUnix) return SystemService.constant.UNIX;
    if (isLinux) return SystemService.constant.LINUX;
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return SystemService.constant.WIN2000;
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return SystemService.constant.WINXP;
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return SystemService.constant.WIN2003;
        var isWin2003 = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWin2003) return SystemService.constant.WINVISTA;
        var isWin2003 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin2003) return SystemService.constant.WIN7;

        return SystemService.constant.WINDOWS;
    }
};


/**
 * 分割url
 * @returns {Array}
 */
SystemService.splitWindowUrl = function (){
    var url = window.location.href;
    url = decodeURI(url);
    let itemStr = url.split("?")[1];
    let items = itemStr.split("&");
    let datas = [];
    for (let i = 0; i < items.length; i++){

        let data = items[i].split("=")[1];
        if(i == 0){
            data = parseInt(data);
        }
        datas.push(data);
    }
    return datas;
};

/**
 * 获取显示器大小
 * @returns size
 */
SystemService.getScreenSize = function (){
    var size = {
        width:window.screen.width,
        height:window.screen.height
    }
    return size;
};



export default SystemService;