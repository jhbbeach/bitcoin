import Constant from './constant';
const electron = window.require('electron');
const {ipcRenderer} = electron;
var i = 0;
var config = {
     //domain: Constant.BaseURL,
     //wsdomain: Constant.WS_BaseURL,
    domain: window.require('electron').remote.getGlobal('frameworkConfig').domain,
    wsdomain: window.require('electron').remote.getGlobal('frameworkConfig').wsdomain,
    project: window.require('electron').remote.getGlobal('frameworkConfig').projectName,
    timeout: 30000,
    domain1: '',
     //project: 'option',
    domain2: '',
    project2: '',
    serviceCallProtocol: "http", // 前端调用service选用的协议, "" 系统会自动选择(优先选择ws,如果不支持再选择http), "http" http调用, "ws" websocket调用
    wsMaxReconnectCount: 5,
    errorHandlers: {
        // 自定义错误处理文件路径, 从app根目录开始
         notLogonHandler: function () {
             ipcRenderer.send("restartAppAlert");
         },
        //
        // permissionDeniedHandler: function () {
        //
        // },
        // versionNotSupportHandler: function () {
        //
        // },
        // sessionInvalidHandler: function () {
        //
        // },
        networkErrorHandler: function () {
            // alert("网络连接异常!");
            // i++;
            // if(i > 5)
            // ipcRenderer.send("restartAppTwo",1);
        },
        noServiceHandler: function () {
            alert("请求无对应服务");
        },
        noInterfaceHandler: function () {
            alert("请求接口错误");
        },
        jsonConvertErrorHandler: function () {
            alert("返回对象无法做json对象转换");
        },
        parameterCountErrorHandler: function () {
            alert("请求参数个数错误");
        },
        parameterTypeErrorHandler: function () {
            alert("请求参数类型错误")
        },
        jsonToJavaErrorHandler: function () {
            alert("请求参数无法转换java对象")
        },
        businessProcessErrorHandler: function () {
            alert("后台业务处理遇到未知错误")
        },
        entityWithoutIdHandler: function () {
            alert("entity定义错误,没有主键Id");
        },
        dbConnectErrorHandler: function () {
            alert("数据库无法获得连接");
        },
        fieldValidateErrorHandler: function (msg) {
            alert('字段校验异常：' + msg)
        },
        timeoutHandler: function () {
            alert("服务访问超时");
        },
        unhandledErrorHandler: function (msg) {
            alert("未知错误");
        }
    },
    changeDomain: function () { // 如果有多个服务端要访问，这种写法用于切换服务端地址，由于使用的是全局变量，要注意异步的问题
        this.domain = this.domain1;
        this.project = this.project1;
    },
    changeDomain1: function () { // 如果有多个服务端要访问，这种写法用于切换服务端地址，由于使用的是全局变量，要注意异步的问题
        this.domain = this.domain2;
        this.project = this.project2;
    },

    changeDomain2: function (url, wsUrl) { // 如果有多个服务端要访问，这种写法用于切换服务端地址，由于使用的是全局变量，要注意异步的问题
        this.domain = url;
        this.wsdomain = wsUrl;
        this.project = this.project1;

        // this.serviceCallProtocol = "";


    },
    changeDomain3: function () { // 如果有多个服务端要访问，这种写法用于切换服务端地址，由于使用的是全局变量，要注意异步的问题
        this.serviceCallProtocol = "";
    }

};
module.exports = config;

//;(function(root) {
//	//domain为空时默认取当前host
//	if(!cffexConfig.domain || cffexConfig.domain=="") {
//		cffexConfig.domain = window.location.protocol+"//"+ window.location.host;
//	}
//	if(cffexConfig.domain=="file://"){
//		cffexConfig.domain = "http://127.0.0.1:8080";
//	}
//	if(!cffexConfig.wsdomain || cffexConfig.wsdomain=="") {
//		cffexConfig.wsdomain = "ws://"+ window.location.host;
//	}
//	if(cffexConfig.wsdomain=="ws://"){
//		cffexConfig.wsdomain = "ws://127.0.0.1:8080";
//	}
//})(window);