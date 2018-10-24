"use strict";

import WebsocketClient from './WebsocketClient';

var huobi = {
    ws: null,
    WS_URL:'wss://api.huobi.pro/ws',
    totalTopics:[],
    wsMaxReconnectCount:-1,//最大重连次数
    reconnectCount:0,//当前重连次数
    ws_Connect(){
        //注册消息接收方法
        this.ws.register(this.ws_msgReceive.bind(this));
        this.reconnectCount = 0;
        for(let temp of this.totalTopics){
            this.ws_subscribe(temp);
        }
    },
    /**
     * ws开始建立连接
     */
    ws_onMsgConnect() {
        if (this.ws !== null) {
            this.ws_msgReconnect();
        } else {
            this.ws = new WebsocketClient();
            this.ws.setOnclose(this.ws_errorOrClose.bind(this));
            this.ws.setOnError(this.ws_errorOrClose.bind(this));
            this.ws.setOnConnect(this.ws_Connect.bind(this));
            this.ws.connect(this.WS_URL);
            // this.ws.bindtouch(this.ws_onTouch.bind(this));
        }
    },
    /**
     * ws开始关闭连接
     */
    ws_onDisConnect() {
        if (this.ws !== null) {
            this.ws.disconnect();
            this.ws = null;
        }
    },
    ws_errorOrClose(){
        this.ws = null;
        this.ws_msgReconnect();
    },
    ws_msgReconnect(){
        if (this.ws !== null) {
            this.ws_unsubscribeAll();
            this.ws = null;
        }
        //断开后隔5s进行重连
        if (this.reconnectCount < this.wsMaxReconnectCount || this.wsMaxReconnectCount === -1){
            setTimeout(() => {
                this.isReconnect = true;
                this.reconnectCount = this.reconnectCount + 1;
                this.ws_onMsgConnect();
            }, 3000);
        } else {
            ipcRenderer.send("wsReport", 14);
        }
    },
    ws_subscribe(topic){
        if(this.totalTopics.indexOf(topic) == -1){
            this.totalTopics.push(topic);
        }
        let data = {
            "sub": `${topic}`,
            "id": `${topic}`
        };
        this.ws.send(data);
    },
    ws_unsubscribe(topic){
        let index = this.totalTopics.indexOf(topic);
        if(index > -1){
            this.totalTopics.splice(index,1);
        }
        let data = {
            "unsub": `${topic}`,
            "id": `${topic}`
        };
        this.ws.send(data);
    },
    ws_unsubscribeAll(){
        for(let topic of this.totalTopics){
            let data = {
                "unsub": `${topic}`,
                "id": `${topic}`
            };
            this.ws.send(data);
        }
    },
    // ws_msgReceive(data){
    //     console.log(data)
    // },
    /**
     * ws关闭
     */
    ws_onMsgClose() {
        if (this.ws !== null && this.ws.isConnected()) {
            for(let temp of this.totalTopics){
                this.ws_unsubscribe(temp);
            }
            this.ws.disconnect();
            this.ws = null;
        }
    },
    ws_onTouch(msg){
        this.ws.send(JSON.stringify({
            pong: msg.ping
        }));
    },
}

export default huobi;