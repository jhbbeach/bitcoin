"use strict";
var pako = require('pako');

// 以下的代码和 ../framework/libraries/websocket/WebsocketClient.js 保持一致
function WebsocketClient() {

    this.websocket = null;
    this.connected = false;

    // 连接关闭时的回调
    this.onclose = null;
    // 连接建立后的回调
    this.onconnect = null;
    // 连接出错的回调
    this.onerror = null;
    // 心跳维持回调
    this.ontouch = null;

    this.unSendMsgLists = [];//未发送的订阅

    this.touchTime = 30 * 1000;

    // 推送消息的外部回调函数 onMsgReceive(topic,data)
    this.onMsgReceive = null;

    // 回调请求的缓存 requestid:{timeout,callback}
    this.serviceReqMap = {};

    // 生成service请求号
    this.uniqueNumber = ((function () {
        var value = 0;
        return function () {
            return ++value;
        };
    })());

}

// service 调用的网络错误
WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_NETWORK = -1;
// service 调用的超时错误
WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_TIMEOUT = -2;
//service 调用的主动关注错误
WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_CLOSE = -3;



//连接
WebsocketClient.prototype.connect = function (fullUrl) {
    try {
        if ('WebSocket' in window) {
            this.websocket = new WebSocket(fullUrl);
        } else if ('MozWebSocket' in window) {
            this.websocket = new MozWebSocket(URL);
        } else {
            console.error("您的浏览器不支持WebSocket,请更换最新版本浏览器");
            return false;
        }

    } catch (e) {
        console.error(e);
        return false;
    }
    var self = this;
    this.websocket.onopen = function (evnt) {
        self.setConnected(true);
        
        for(let t of self.unSendMsgLists){
            self.send(t);
        }
        self.unSendMsgLists = [];

        if (self.onconnect != null) {
            self.onconnect(evnt);
        }
        console.log('connect success.');

        setTimeout(_WebsocketClientTouch(this), this.touchTime);
    };
    this.websocket.onerror = function (evnt) {
        self.log('错误: ' + JSON.stringify(evnt));

        self.setConnected(false);
        self.onclose = null;
        if (self.onerror != null) {
            self.onerror(evnt);
        }

        self.disconnect(evnt);

    };
    this.websocket.onclose = function (evnt) {
        if (self.onclose != null && (event != null || event.code != 1000)) {
            self.onclose(evnt);
            self.onclose = null;
        }
        self.disconnect(evnt);
    };
    // 处理报文收取
    this.websocket.onmessage = function (evnt) {

        try {
            if(typeof evnt.data === String) {
                var response = JSON.parse(evnt.data);
                if (response.data != "") {
                    if (self.onMsgReceive != null) {
                        self.onMsgReceive(JSON.parse(response.data));
                    }
                }
            }else if(evnt.data instanceof ArrayBuffer){
                console.log("Received arraybuffer");
            }else if(evnt.data instanceof Blob){
                var blob = evnt.data;
                var reader = new FileReader();
                reader.readAsBinaryString(blob);
                reader.onload = function(evt){  
                    if(evt.target.readyState == FileReader.DONE){  
                        var imgFlag = evt.target.result; 
                        let text = pako.inflate(imgFlag, {
                            to: 'string'
                        });
                        let temp = JSON.parse(text);
                        self.onMsgReceive(temp);
                    }else{
                        console.log(evnt.data);
                    }
                }
            }
        }
        catch (e) {
            console.error(e + ":" + evnt.data);
        }

    }

    // begin touch
    // setTimeout(_WebsocketClientTouch(this), this.touchTime);
    return true;
};

WebsocketClient.prototype.setOnclose = function (func) {
    if (func === undefined || func == null) {
        return;
    }

    this.onclose = func;
};

// 连接成功回调
WebsocketClient.prototype.setOnConnect = function (func) {
    if (func === undefined || func == null) {
        return;
    }

    this.onconnect = func;
};

// 连接异常回调
WebsocketClient.prototype.setOnError = function (func) {
    if (func === undefined || func == null) {
        return;
    }

    this.onerror = func;
};


//发送消息
WebsocketClient.prototype.send = function (data) {
    if(this.connected){
        this.websocket.send(JSON.stringify(data));
    }else{
        this.unSendMsgLists.push(data);
    }
};

//订阅
WebsocketClient.prototype.subscribe = function (topic, params) {

    // if (topic === undefined || topic == null || topic == "") {
    //     console.error("订阅主题不正确");
    //     return;
    // }

    // var data = {oper: 'subscribe', topic: topic};

    // if(params != null && params !== undefined) {
    //     data.params = params;
    // }

    // this.send(data);

};
//取消订阅
WebsocketClient.prototype.unsubscribe = function (topic, params) {

    // if (topic === undefined || topic == null || topic == "") {
    //     console.error("订阅主题不正确");
    //     return;
    // }

    // var data = {oper: 'unsubscribe', topic: topic};
    // if(params != null && params !== undefined) {
    //     data.params = params;
    // }
    // this.send(data);
};
//注册消息接收方法
WebsocketClient.prototype.register = function (callback) {
    this.onMsgReceive = callback;
};

//退出
WebsocketClient.prototype.disconnect = function () {
    if (this.websocket != null) {
        this.websocket.close(1000, "关闭连接");
        this.websocket = null;
        this.onclose = null;
        this.onconnect = null;
        this.onerror = null;

        this.log("关闭连接");
        this.setConnected(false);

        this.serviceReqMap = null;
    }
};
//设置连接状态
WebsocketClient.prototype.setConnected = function (flag) {
    this.connected = flag;
};
//判断是否连接
WebsocketClient.prototype.isConnected = function () {
    return this.connected;
};

WebsocketClient.prototype.log = function (message) {
    console.info(message);
};

// 注册心跳函数
WebsocketClient.prototype.bindtouch = function (func) {
    if (func === undefined || func == null) {
        return;
    }
    this.ontouch = func;
};

// touch的时间间隔
WebsocketClient.prototype.setTouchTime = function (time) {
    this.touchTime = time;
};

// 调用service
// callback(headerErrorCode, errCode, errMsg, result)
// headerErrorCode: -2 代表超时, -1 代表网络出现问题
WebsocketClient.prototype.callService = function (service, method, params, callback, timeout = 1000) {

    // -1 代表网络出现问题
    if (this.connected == false) {
        callback(WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_NETWORK);
    }

    // 拼装需要发送的对象报文
    var data = {oper: 'callservice'};
    var requestId = this.uniqueNumber();
    requestId = requestId.toString();
    data.requestId = requestId;
    data.url = "/service/" + service + "/" + method;
    data.params = params;
    data.method = "POST";

    // 指定超时回调
    var t = setTimeout(function () {
        if (this.serviceReqMap == null || typeof this.serviceReqMap[requestId] == "undefined" || this.serviceReqMap[requestId] == null) {
            return;
        }

        var callback = this.serviceReqMap[requestId].callback;

        // -2 代表超时, -1 代表网络出现问题
        if (callback != null) {
            callback(WebsocketClient.prototype.SERVICE_CALL_ERROR_CODE_TIMEOUT);
        }

        delete this.serviceReqMap[requestId];

    }.bind(this), timeout);

    // 指定回调
    this.serviceReqMap[requestId] = {callback: callback, timeout: t};

    // 发送报文
    this.send(data);
};

// 保持心跳回调函数
function _WebsocketClientTouch(socketClient) {

    var client = socketClient;
    return function () {
        if (client.ontouch === undefined || client.ontouch == null) {
            return;
        }
        client.ontouch();
        // client.touch();
    }

};

module.exports = WebsocketClient;

