"use strict";

import WebsocketClient from '../lib/WebsocketClient';
import console from '../console.js';
import Constant from '../constant';
import Config from '../config';

const electron = window.require('electron');
const {ipcRenderer} = electron;


var WSClient = {
    ws: null,
    isReconnect:false,
    userInfo:null,
    totalTopics:[],
    quotaTopic:[],
    theoryPriceTopic:[],
    markerStrategyTopic:[],
    futureMarkerStrategyTopic:[],
    atmInfoTopic:[],
    reconnectCount:0,
    //是否订阅成交回报
    hasSubscribeTradeReturn:false,
    //是否订阅委托回报
    hasSubscribeOrderReturn:false,
    //是否订阅指令回报
    hasSubscribeInstruction:false,
    //是否订阅持仓回报
    hasSubscribePosition: false,
    //是否订阅资金回报
    hasSubscribePortfolioBalance: false,
    //是否订阅做市委托
    hasSubscribeQuoteTotalTrade: false,

    /**
     * 获取委托状态
     * @param status
     * @private
     */
    _getOrderStatus(status) {
        switch (status) {
            case "0":
                return "全部成交";
            case "1":
                return "部分成交还在队列中";
            case "2":
                return "部分成交不在队列中";
            case "3":
                return "未成交还在队列中";
            case "4":
                return "未成交不在队列中";
            case "5":
                return "撤单";
            case "6":
                return "订单已报入交易所未应答";
            case "7":
                return "部分撤单还在队列中";
            case "8":
                return "部分成交部分撤单还在队列中";
            default:
                return "";
        }
    },

     /**
      * ws收到推送消息
      * @param topic
      * @param receiveData
      */
     ws_msgReceive(topic, receiveData) {
         let data = receiveData;
         if (data != undefined && data != null){
             if (topic != undefined && topic != null){
                 if (topic.match("public_greeks_")){
                     //指标推送
                     ipcRenderer.send('wsReport', 12, data);
                 } else if (topic.match("public_instrument_")) {
                     //行情推送
                     ipcRenderer.send('wsReport', 7, data);
                 } else if (topic.match("public_tradereturn_")) {
                     //成交回报
                     ipcRenderer.send('wsReport', 6, data);
                 } else if (topic.match("public_orderreturn_")) {
                     //委托回报
                     ipcRenderer.send('wsReport', 5, data);
                 } else if (topic.match("public_instructionreturn_")){
                     //指令回报
                     ipcRenderer.send('wsReport', 10, data);
                 } else if (topic.match("public_position_")){
                     //持仓回报
                     ipcRenderer.send('wsReport', 16, data);
                 } else if (topic.match("public_portfoliobalance_")){
                     //资金回报
                     ipcRenderer.send('wsReport', 18, data);
                 } else if (topic.match("public_theoryprice_")){
                     //理论价行情回报
                     ipcRenderer.send('wsReport', 20, data);
                 } else if (topic.match("public_quote_total_trade_price")){
                    //做市报价委托价格回报
                     ipcRenderer.send('wsReport', 32, data);
                 } else if (topic.match("public_quote_total_trade_position")){
                    //做市报价委托持仓回报
                     ipcRenderer.send('wsReport', 33, data);
                 } else if (topic.match("public_markerstrategy_")){
                     //做市策略设置回报
                     ipcRenderer.send('wsReport', 25, data);
                 } else if (topic.match("public_userswitch_")){
                     //开关设置回报
                     ipcRenderer.send('wsReport', 28, data);
                 } else if (topic.match("public_atmInfo_")){
                    //Atm回报接收
                    ipcRenderer.send('wsReport', 36, data);
                } else if (topic.match("public_futuremakerhedgestatus_")){
                    //期货对冲报价回报接收
                    ipcRenderer.send('wsReport', 39, data);
                }
             }
         }
     },

    /**
     * ws是否连接
     * @returns {boolean}
     */
    ws_stateOnConnect() {
        let isConnect = false;
        if (this.ws !== null && this.ws.isConnected()) {
            isConnect = true;
        }
        return isConnect;
    },

    ws_Connect(){
        //注册消息接收方法
        this.ws.register(this.ws_msgReceive.bind(this));
        this.reconnectCount = 0;
        if (this.totalTopics.length > 0){
            let instrumentIds = '';
            for (let i = 0; i < this.totalTopics.length; i++){
                instrumentIds = instrumentIds + 'public_instrument_' + this.totalTopics[i].instrumentId + ","
            }
            this.ws.subscribe(instrumentIds);
        }

        if (this.quotaTopic.length > 0 && this.userInfo != null){
            let subscribeTopics = '';
            for (let i = 0; i < this.quotaTopic.length; i++){
                subscribeTopics = subscribeTopics + 'public_greeks_' + this.userInfo.userId + "_" + this.quotaTopic[i].instrumentId + ","
            }
            this.ws.subscribe(subscribeTopics);
        }

        if (this.theoryPriceTopic.length > 0 && this.userInfo != null){
            let instrumentIds = '';
            for (let i = 0; i < this.theoryPriceTopic.length; i++){
                instrumentIds = instrumentIds + 'public_theoryprice_' + this.userInfo.userId + "_" + this.theoryPriceTopic[i].instrumentId + ","
            }
            this.ws.subscribe(instrumentIds);
        }

        if (this.markerStrategyTopic.length > 0){
            let instrumentIds = '';
            for (let i = 0; i < this.markerStrategyTopic.length; i++){
                instrumentIds = instrumentIds + 'public_markerstrategy_' + this.userInfo.userId + ","
                //instrumentIds = instrumentIds + 'public_markerstrategy_' + this.markerStrategyTopic[i].instrumentId + ","
            }
            console.log(instrumentIds);
            this.ws.subscribe(instrumentIds);
        }
        if (this.atmInfoTopic.length > 0){
            let instrumentIds = '';
            for (let i = 0; i < this.atmInfoTopic.length; i++){
                instrumentIds = instrumentIds + 'public_atmInfo_' + this.userInfo.userId  + "_" + this.atmInfoTopic[i].instrumentId + ","
            }
            this.ws.subscribe(instrumentIds);
        }
        if (this.futureMarkerStrategyTopic.length > 0){
            let instrumentIds = '';
            for (let i = 0; i < this.futureMarkerStrategyTopic.length; i++){
                instrumentIds = instrumentIds + 'public_futuremakerhedgestatus_' + this.userInfo.userId  + "_" + this.futureMarkerStrategyTopic[i].instrumentId + ","
            }
            this.ws.subscribe(instrumentIds);
        }

        if (this.userInfo != null){
            this.ws.subscribe('public_orderreturn_' + this.userInfo.userId);
            this.hasSubscribeOrderReturn = true;

            this.ws.subscribe('public_tradereturn_' + this.userInfo.userId);
            this.hasSubscribeTradeReturn = true;

            this.ws.subscribe('public_position_' + this.userInfo.userId);
            this.hasSubscribePosition = true;

            this.ws.subscribe('public_portfoliobalance_' + this.userInfo.userId);
            this.hasSubscribePortfolioBalance = true;

            this.ws.subscribe('public_instructionreturn_' + this.userInfo.userId);
            this.hasSubscribeInstruction = true;

            this.ws.subscribe('public_quote_total_trade_price' + this.userInfo.userId);
            this.hasSubscribeQuoteTotalTradePrice = true;

            this.ws.subscribe('public_quote_total_trade_position' + this.userInfo.userId);
            this.hasSubscribeQuoteTotalTradePosition = true;

            this.ws.subscribe('public_userswitch_' + this.userInfo.userId);
        }

        if (this.isReconnect){
            ipcRenderer.send("wsReport", 4);
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
            this.ws.setOnclose(this.ws_msgReconnect.bind(this));
            this.ws.setOnError(this.ws_msgReconnect.bind(this));
            this.ws.setOnConnect(this.ws_Connect.bind(this));
            this.ws.connect('public');
        }
    },

    /**
     * 订阅指标变化
     * @param topics
     */
    addQuotaSubscribe(topics){
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                for (let i = 0; i < topics.length; i++){
                    let position = -1;
                    for (let j = 0; j < this.quotaTopic.length; j++){
                        if (topics[i].instrumentId === this.quotaTopic[j].instrumentId){
                            position = j;
                            break;
                        }
                    }
                    if (position == -1){
                        topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                        this.quotaTopic.push(topics[i]);
                        instrumentIds = instrumentIds + 'public_greeks_' + this.userInfo.userId + "_" + topics[i].instrumentId + ","
                    } else {
                        if (this.quotaTopic[position].subscribeNumber == 0){
                            instrumentIds = instrumentIds + 'public_greeks_' + this.userInfo.userId + "_" + this.quotaTopic[position].instrumentId + ","
                        }
                        this.quotaTopic[position].subscribeNumber = this.quotaTopic[position].subscribeNumber === undefined ? 1 : this.quotaTopic[position].subscribeNumber + 1;
                    }
                }
                if (instrumentIds !== ''){
                    this.ws.subscribe(instrumentIds);
                }
            }
        } else {
            for (let i = 0; i < topics.length; i++){
                let position = -1;
                for (let j = 0; j < this.quotaTopic.length; j++){
                    if (topics[i].instrumentId === this.quotaTopic[j].instrumentId){
                        position = j;
                        break;
                    }
                }
                if (position == -1){
                    topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                    this.quotaTopic.push(topics[i]);
                } else {
                    this.quotaTopic[position].subscribeNumber = this.quotaTopic[position].subscribeNumber === undefined ? 1 : this.quotaTopic[position].subscribeNumber + 1;
                }
            }
            this.ws_onMsgConnect();
        }
    },

    /**
     * 添加行情订阅
     */
    addOptionalsSubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                for (let i = 0; i < topics.length; i++){
                    let position = -1;
                    for (let j = 0; j < this.totalTopics.length; j++){
                        if (topics[i].instrumentId === this.totalTopics[j].instrumentId){
                            position = j;
                            break;
                        }
                    }
                    if (position == -1){
                        topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                        this.totalTopics.push(topics[i]);
                        instrumentIds = instrumentIds + 'public_instrument_' + topics[i].instrumentId + ","
                    } else {
                        if (this.totalTopics[position].subscribeNumber == 0){
                            instrumentIds = instrumentIds + 'public_instrument_' + this.totalTopics[position].instrumentId + ","
                        }
                        this.totalTopics[position].subscribeNumber = this.totalTopics[position].subscribeNumber === undefined ? 1 : this.totalTopics[position].subscribeNumber + 1;
                    }
                }
                if (instrumentIds !== ''){
                    this.ws.subscribe(instrumentIds);
                }
            }
        } else {
            for (let i = 0; i < topics.length; i++){
                let position = -1;
                for (let j = 0; j < this.totalTopics.length; j++){
                    if (topics[i].instrumentId === this.totalTopics[j].instrumentId){
                        position = j;
                        break;
                    }
                }
                if (position == -1){
                    topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                    this.totalTopics.push(topics[i]);
                } else {
                    this.totalTopics[position].subscribeNumber = this.totalTopics[position].subscribeNumber === undefined ? 1 : this.totalTopics[position].subscribeNumber + 1;
                }
            }
            this.ws_onMsgConnect();
        }
    },
    /**
     * 删除行情订阅
     */
    deleteOptionalsSubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                let newTotalTopics = [];

                for (let j = 0; j < this.totalTopics.length; j++){
                    for (let i = 0; i < topics.length; i++){
                        if (topics[i].instrumentId == this.totalTopics[j].instrumentId){
                            if (this.totalTopics[j].subscribeNumber == 1){
                                instrumentIds = instrumentIds + 'public_instrument_' + topics[i].instrumentId + ",";
                            }
                            this.totalTopics[j].subscribeNumber = this.totalTopics[j].subscribeNumber === 0 ? 0 : this.totalTopics[j].subscribeNumber - 1;
                            break;
                        }
                    }
                    if (this.totalTopics[j].subscribeNumber > 0){
                        newTotalTopics.push(this.totalTopics[j]);
                    }
                }
                this.totalTopics = newTotalTopics;
                if (instrumentIds !== ''){
                    this.ws.unsubscribe(instrumentIds);
                }
            }
        }
    },
    /**
     * 添加Atm订阅
     */
    addAtmInfoReturnSubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                for (let i = 0; i < topics.length; i++){
                    let position = -1;
                    for (let j = 0; j < this.atmInfoTopic.length; j++){
                        if (topics[i].instrumentId === this.atmInfoTopic[j].instrumentId){
                            position = j;
                            break;
                        }
                    }
                    if (position == -1){
                        topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                        this.atmInfoTopic.push(topics[i]);
                        instrumentIds = instrumentIds + 'public_atmInfo_' + this.userInfo.userId  + "_" + topics[i].instrumentId + ","
                    } else {
                        if (this.atmInfoTopic[position].subscribeNumber == 0){
                            instrumentIds = instrumentIds + 'public_atmInfo_' + this.userInfo.userId + "_" + this.atmInfoTopic[position].instrumentId + ","
                        }
                        this.atmInfoTopic[position].subscribeNumber = this.atmInfoTopic[position].subscribeNumber === undefined ? 1 : this.atmInfoTopic[position].subscribeNumber + 1;
                    }
                }
                if (instrumentIds !== ''){
                    this.ws.subscribe(instrumentIds);
                }
            }
        } else {
            for (let i = 0; i < topics.length; i++){
                let position = -1;
                for (let j = 0; j < this.atmInfoTopic.length; j++){
                    if (topics[i].instrumentId === this.atmInfoTopic[j].instrumentId){
                        position = j;
                        break;
                    }
                }
                if (position == -1){
                    topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                    this.atmInfoTopic.push(topics[i]);
                } else {
                    this.atmInfoTopic[position].subscribeNumber = this.atmInfoTopic[position].subscribeNumber === undefined ? 1 : this.atmInfoTopic[position].subscribeNumber + 1;
                }
            }
            this.ws_onMsgConnect();
        }
    },
    /**
     * 删除atm订阅
     */
    deleteAtmSubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                let newTotalTopics = [];

                for (let j = 0; j < this.atmInfoTopic.length; j++){
                    for (let i = 0; i < topics.length; i++){
                        if (topics[i].instrumentId == this.atmInfoTopic[j].instrumentId){
                            if (this.atmInfoTopic[j].subscribeNumber == 1){
                                instrumentIds = instrumentIds + 'public_atmInfo_' + this.userInfo.userId  + "_" + topics[i].instrumentId + ",";
                                
                            }
                            this.atmInfoTopic[j].subscribeNumber = this.atmInfoTopic[j].subscribeNumber === 0 ? 0 : this.atmInfoTopic[j].subscribeNumber - 1;
                            break;
                        }
                    }
                    if (this.atmInfoTopic[j].subscribeNumber > 0){
                        newTotalTopics.push(this.atmInfoTopic[j]);
                    }
                }
                this.atmInfoTopic = newTotalTopics;
                if (instrumentIds !== ''){
                    this.ws.unsubscribe(instrumentIds);
                }
            }
        }
    },
    

    /**
     * 删除指标变化订阅
     * @param topics
     */
    deleteQuotaSubscribe(topics){
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                let newQuotaTopic = [];

                for (let j = 0; j < this.quotaTopic.length; j++){
                    for (let i = 0; i < topics.length; i++){
                        if (topics[i].instrumentId == this.quotaTopic[j].instrumentId){
                            if (this.quotaTopic[j].subscribeNumber == 1){
                                instrumentIds = instrumentIds + 'public_greeks_' + this.userInfo.userId + "_" + topics[i].instrumentId + ",";
                            }
                            this.quotaTopic[j].subscribeNumber = this.quotaTopic[j].subscribeNumber === 0 ? 0 : this.quotaTopic[j].subscribeNumber - 1;
                            break;
                        }
                    }
                    if (this.quotaTopic[j].subscribeNumber > 0){
                        newQuotaTopic.push(this.quotaTopic[j]);
                    }
                }
                this.quotaTopic = newQuotaTopic;
                if (instrumentIds !== ''){
                    this.ws.unsubscribe(instrumentIds);
                }
            }
        }

    },


    /**
     * 添加理论价行情订阅
     */
    addTheoryPriceSubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                for (let i = 0; i < topics.length; i++){
                    let position = -1;
                    for (let j = 0; j < this.theoryPriceTopic.length; j++){
                        if (topics[i].instrumentId === this.theoryPriceTopic[j].instrumentId){
                            position = j;
                            break;
                        }
                    }
                    if (position == -1){
                        topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                        this.theoryPriceTopic.push(topics[i]);
                        instrumentIds = instrumentIds + 'public_theoryprice_' + this.userInfo.userId + "_" + topics[i].instrumentId + ","
                    } else {
                        if (this.theoryPriceTopic[position].subscribeNumber == 0){
                            instrumentIds = instrumentIds + 'public_theoryprice_' + this.userInfo.userId + "_" + this.theoryPriceTopic[position].instrumentId + ","
                        }
                        this.theoryPriceTopic[position].subscribeNumber = this.theoryPriceTopic[position].subscribeNumber === undefined ? 1 : this.theoryPriceTopic[position].subscribeNumber + 1;
                    }
                }
                if (instrumentIds !== ''){
                    this.ws.subscribe(instrumentIds);
                }
            }
        } else {
            for (let i = 0; i < topics.length; i++){
                let position = -1;
                for (let j = 0; j < this.theoryPriceTopic.length; j++){
                    if (topics[i].instrumentId === this.theoryPriceTopic[j].instrumentId){
                        position = j;
                        break;
                    }
                }
                if (position == -1){
                    topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                    this.theoryPriceTopic.push(topics[i]);
                } else {
                    this.theoryPriceTopic[position].subscribeNumber = this.theoryPriceTopic[position].subscribeNumber === undefined ? 1 : this.theoryPriceTopic[position].subscribeNumber + 1;
                }
            }
            this.ws_onMsgConnect();
        }
    },


    /**
     * 删除理论价行情订阅
     */
    deleteTheoryPriceSubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                let newTotalTopics = [];
                for (let j = 0; j < this.theoryPriceTopic.length; j++){
                    for (let i = 0; i < topics.length; i++){
                        if (topics[i].instrumentId == this.theoryPriceTopic[j].instrumentId){
                            if (this.theoryPriceTopic[j].subscribeNumber == 1){
                                instrumentIds = instrumentIds + 'public_theoryprice_' + this.userInfo.userId + "_" + topics[i].instrumentId + ",";
                            }
                            this.theoryPriceTopic[j].subscribeNumber = this.theoryPriceTopic[j].subscribeNumber === 0 ? 0 : this.theoryPriceTopic[j].subscribeNumber - 1;
                            break;
                        }
                    }
                    if (this.theoryPriceTopic[j].subscribeNumber > 0){
                        newTotalTopics.push(this.theoryPriceTopic[j]);
                    }
                }
                this.theoryPriceTopic = newTotalTopics;
                if (instrumentIds !== ''){
                    this.ws.unsubscribe(instrumentIds);
                }
            }
        }
    },


    /**
     * 期货对冲报价状态通知推送
     */
    addFutureMakerHedgeStatusSubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                for (let i = 0; i < topics.length; i++){
                    let position = -1;
                    for (let j = 0; j < this.futureMarkerStrategyTopic.length; j++){
                        if (topics[i].instrumentId === this.futureMarkerStrategyTopic[j].instrumentId){
                            position = j;
                            break;
                        }
                    }
                    if (position == -1){
                        topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                        this.futureMarkerStrategyTopic.push(topics[i]);
                        instrumentIds = instrumentIds + 'public_futuremakerhedgestatus_' + this.userInfo.userId + "_" + topics[i].instrumentId + ","
                    } else {
                        if (this.futureMarkerStrategyTopic[position].subscribeNumber == 0){
                            instrumentIds = instrumentIds + 'public_futuremakerhedgestatus_' + this.userInfo.userId + "_" + topics[i].instrumentId + ","
                        }
                        this.futureMarkerStrategyTopic[position].subscribeNumber = this.futureMarkerStrategyTopic[position].subscribeNumber === undefined ? 1 : this.futureMarkerStrategyTopic[position].subscribeNumber + 1;
                    }
                }
                if (instrumentIds !== ''){
                    this.ws.subscribe(instrumentIds);
                }
            }
        } else {
            for (let i = 0; i < topics.length; i++){
                let position = -1;
                for (let j = 0; j < this.futureMarkerStrategyTopic.length; j++){
                    if (topics[i].instrumentId === this.futureMarkerStrategyTopic[j].instrumentId){
                        position = j;
                        break;
                    }
                }
                if (position == -1){
                    topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                    this.futureMarkerStrategyTopic.push(topics[i]);
                } else {
                    this.futureMarkerStrategyTopic[position].subscribeNumber = this.futureMarkerStrategyTopic[position].subscribeNumber === undefined ? 1 : this.futureMarkerStrategyTopic[position].subscribeNumber + 1;
                }
            }
            this.ws_onMsgConnect();
        }
    },
    /**
     * 添加做市设置订阅
     */
    addMarkerStrategySubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                for (let i = 0; i < topics.length; i++){
                    let position = -1;
                    for (let j = 0; j < this.markerStrategyTopic.length; j++){
                        if (topics[i].instrumentId === this.markerStrategyTopic[j].instrumentId){
                            position = j;
                            break;
                        }
                    }
                    if (position == -1){
                        topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                        this.markerStrategyTopic.push(topics[i]);
                        instrumentIds = instrumentIds + 'public_markerstrategy_' + this.userInfo.userId  + ","
                        //instrumentIds = instrumentIds + 'public_markerstrategy_' + topics[i].instrumentId + ","
                    } else {
                        if (this.markerStrategyTopic[position].subscribeNumber == 0){
                            instrumentIds = instrumentIds + 'public_markerstrategy_' + this.userInfo.userId  + ","
                            //instrumentIds = instrumentIds + 'public_markerstrategy_' + this.markerStrategyTopic[position].instrumentId + ","
                        }
                        this.markerStrategyTopic[position].subscribeNumber = this.markerStrategyTopic[position].subscribeNumber === undefined ? 1 : this.markerStrategyTopic[position].subscribeNumber + 1;
                    }
                }
                if (instrumentIds !== ''){
                    this.ws.subscribe(instrumentIds);
                }
            }
        } else {
            for (let i = 0; i < topics.length; i++){
                let position = -1;
                for (let j = 0; j < this.markerStrategyTopic.length; j++){
                    if (topics[i].instrumentId === this.markerStrategyTopic[j].instrumentId){
                        position = j;
                        break;
                    }
                }
                if (position == -1){
                    topics[i].subscribeNumber = topics[i].subscribeNumber === undefined ? 1 : topics[i].subscribeNumber + 1;
                    this.markerStrategyTopic.push(topics[i]);
                } else {
                    this.markerStrategyTopic[position].subscribeNumber = this.markerStrategyTopic[position].subscribeNumber === undefined ? 1 : this.markerStrategyTopic[position].subscribeNumber + 1;
                }
            }
            this.ws_onMsgConnect();
        }
    },

    /**
     * 删除做市设置订阅
     */
    deleteMarkerStrategySubscribe(topics) {
        if (this.ws != null && this.ws.isConnected()) {
            if (topics.length > 0){
                let instrumentIds = '';
                let newTotalTopics = [];
                for (let j = 0; j < this.markerStrategyTopic.length; j++){
                    for (let i = 0; i < topics.length; i++){
                        if (topics[i].instrumentId == this.markerStrategyTopic[j].instrumentId){
                            if (this.markerStrategyTopic[j].subscribeNumber == 1){
                                instrumentIds = instrumentIds + 'public_markerstrategy_' + this.userInfo.userId + ",";
                                //instrumentIds = instrumentIds + 'public_markerstrategy_' + topics[i].instrumentId + ",";
                            }
                            this.markerStrategyTopic[j].subscribeNumber = this.markerStrategyTopic[j].subscribeNumber === 0 ? 0 : this.markerStrategyTopic[j].subscribeNumber - 1;
                            break;
                        }
                    }
                    if (this.markerStrategyTopic[j].subscribeNumber > 0){
                        newTotalTopics.push(this.markerStrategyTopic[j]);
                    }
                }
                this.markerStrategyTopic = newTotalTopics;
                if (instrumentIds !== ''){
                    this.ws.unsubscribe(instrumentIds);
                }
            }
        }
    },

    /**
     * 添加成交回报订阅
     * @param userInfo
     */
    addTradeReturnSubscribe(userInfo) {
        if (userInfo !== undefined && userInfo !== null){
            this.userInfo = userInfo;
            if (this.hasSubscribeTradeReturn){
                console.log('trade return has been subscribe!');
                return;
            }
            if (this.ws != null && this.ws.isConnected()) {
                this.ws.subscribe('public_tradereturn_' + userInfo.userId);
                this.hasSubscribeTradeReturn = true;
            } else {
                this.ws_onMsgConnect();
            }
        }

    },

    /**
     * 添加委托回报订阅
     * @param userInfo
     * @private
     */
    addOrderReturnSubscribe(userInfo){
        if (userInfo !== undefined && userInfo !== null){
            this.userInfo = userInfo;
            if (this.hasSubscribeOrderReturn){
                console.log('order return has been subscribe!');
                return;
            }
            if (this.ws != null && this.ws.isConnected()) {
                if (userInfo != null){
                    this.ws.subscribe('public_orderreturn_' + userInfo.userId);
                }
                this.hasSubscribeOrderReturn = true;
            } else {
                this.ws_onMsgConnect();
            }
        }
    },

    /**
     * 添加做市委托回报价格订阅
     * @param userInfo
     * @private
     */
    addQuoteTotalTradePriceSubscribe(userInfo){
        if (userInfo){
            this.userInfo = userInfo;
            if (this.hasSubscribeQuoteTotalTradePrice){
                console.log('quote total trade has been subscribe!');
                return;
            }
            if (this.ws != null && this.ws.isConnected()) {
                this.ws.subscribe('public_quote_total_trade_price' + userInfo.userId);
                this.hasSubscribeQuoteTotalTradePrice = true;
            } else {
                this.ws_onMsgConnect();
            }
        }
    },
    /**
     * 添加做市委托回报持仓订阅
     * @param userInfo
     * @private
     */
    addQuoteTotalTradePositionSubscribe(userInfo){
        if (userInfo){
            this.userInfo = userInfo;
            if (this.hasSubscribeQuoteTotalTradePosition){
                console.log('quote total trade has been subscribe!');
                return;
            }
            if (this.ws != null && this.ws.isConnected()) {
                this.ws.subscribe('public_quote_total_trade_position' + userInfo.userId);
                this.hasSubscribeQuoteTotalTradePosition = true;
            } else {
                this.ws_onMsgConnect();
            }
        }
    },

    /**
     * 指令订阅
     * @param userInfo
     */
    addInstructionSubscribe(userInfo){
        if (this.hasSubscribeInstruction){
            console.log('instruction has been subscribe!');
            return;
        }
        if (this.ws != null && this.ws.isConnected()) {
            if (userInfo != null){
                this.ws.subscribe('public_instructionreturn_' + userInfo.userId);
            }
            this.userInfo = userInfo;
            this.hasSubscribeInstruction = true;
        } else {
            this.userInfo = userInfo;
            this.ws_onMsgConnect();
        }
    },

    /**
     * 持仓订阅
     * @param userInfo
     */
    addPositionSubscribe(userInfo){
        if (this.hasSubscribePosition){
            console.log('position has been subscribe!');
            return;
        }
        if (this.ws != null && this.ws.isConnected()) {
            if (userInfo != null){
                this.ws.subscribe('public_position_' + userInfo.userId);
            }
            this.userInfo = userInfo;
            this.hasSubscribePosition = true;
        } else {
            this.userInfo = userInfo;
            this.ws_onMsgConnect();
        }
    },

    /**
     * 资金订阅
     * @param userInfo
     */
    addPortfolioBalanceSubscribe(userInfo){
        if (this.hasSubscribePortfolioBalance){
            console.log('portfolio balance has been subscribe!');
            return;
        }
        if (this.ws != null && this.ws.isConnected()) {
            if (userInfo != null){
                this.ws.subscribe('public_portfoliobalance_' + userInfo.userId);
            }
            this.userInfo = userInfo;
            this.hasSubscribePortfolioBalance = true;
        } else {
            this.userInfo = userInfo;
            this.ws_onMsgConnect();
        }
    },

    /**
     * 用户开关订阅
     * @param userInfo
     */
    addUserSwitchSubscribe(userInfo){
        if (this.ws != null && this.ws.isConnected()) {
            if (userInfo != null){
                this.ws.subscribe('public_userswitch_' + userInfo.userId);
            }
            this.userInfo = userInfo;
        } else {
            this.userInfo = userInfo;
            this.ws_onMsgConnect();
        }
    },

    /**
     * ws关闭
     */
    ws_onMsgClose() {
        if (this.ws !== null && this.ws.isConnected()) {
            if (this.totalTopics.length > 0){
                let instrumentIds = '';
                for (let i = 0; i < this.totalTopics.length; i++){
                    instrumentIds = instrumentIds + 'public_instrument_' + this.totalTopics[i].instrumentId + ",";
                }
                this.ws.unsubscribe(instrumentIds);
            }

            if (this.quotaTopic.length > 0 && this.userInfo != null){
                let subscribeTopics = '';
                console.log('public_greeks_' + this.userInfo.userId)
                for (let i = 0; i < this.quotaTopic.length; i++){
                    subscribeTopics = subscribeTopics + 'public_greeks_' + this.userInfo.userId + "_" + this.quotaTopic[i].instrumentId + ","
                }
                this.ws.unsubscribe(subscribeTopics);
            }

            if (this.theoryPriceTopic.length > 0){
                let subscribeTopics = '';
                for (let i = 0; i < this.theoryPriceTopic.length; i++){
                    subscribeTopics = subscribeTopics + 'public_theoryprice_' + this.userInfo.userId + "_" + this.theoryPriceTopic[i].instrumentId + ","
                }
                this.ws.unsubscribe(subscribeTopics);
            }

            if (this.markerStrategyTopic.length > 0){
                let subscribeTopics = '';
                for (let i = 0; i < this.markerStrategyTopic.length; i++){
                    subscribeTopics = subscribeTopics + 'public_markerstrategy_' + this.userInfo.userId + ","
                    //subscribeTopics = subscribeTopics + 'public_markerstrategy_' + this.markerStrategyTopic[i].instrumentId + ","
                }
                this.ws.unsubscribe(subscribeTopics);
            }
            if (this.atmInfoTopic.length > 0){
                let subscribeTopics = '';
                for (let i = 0; i < this.atmInfoTopic.length; i++){
                    subscribeTopics = subscribeTopics + 'public_atmInfo_' + this.userInfo.userId  + "_" + this.atmInfoTopic[i].instrumentId + ","
                    //subscribeTopics = subscribeTopics + 'public_markerstrategy_' + this.markerStrategyTopic[i].instrumentId + ","
                }
                this.ws.unsubscribe(subscribeTopics);
            }

            if (this.userInfo != null){
                this.ws.unsubscribe('public_orderreturn_' + this.userInfo.userId);
                this.hasSubscribeOrderReturn = false;

                this.ws.unsubscribe('public_tradereturn_' + this.userInfo.userId);
                this.hasSubscribeTradeReturn = false;

                this.ws.unsubscribe('public_position_' + this.userInfo.userId);
                this.hasSubscribePosition = false;

                this.ws.unsubscribe('public_portfoliobalance_' + this.userInfo.userId);
                this.hasSubscribePortfolioBalance = false;

                this.ws.unsubscribe('public_instructionreturn_' + this.userInfo.userId);
                this.hasSubscribeInstruction = false;

                this.ws.unsubscribe('public_quote_total_trade_price' + this.userInfo.userId);
                this.hasSubscribeQuoteTotalTradePrice = false;
                this.ws.unsubscribe('public_quote_total_trade_position' + this.userInfo.userId);
                this.hasSubscribeQuoteTotalTradePosition = false;

                this.ws.unsubscribe('public_userswitch_' + this.userInfo.userId);
            }

            this.ws.disconnect();
            this.ws = null;
        }
    },

    /**
     * ws重连
     */
    ws_msgReconnect() {
        if (this.ws !== null) {
            this.ws_onMsgClose();
            this.ws = null;
        }
        //断开后隔5s进行重连
        if (this.reconnectCount < Config.wsMaxReconnectCount || Config.wsMaxReconnectCount === -1){
            setTimeout(() => {
                this.isReconnect = true;
                this.reconnectCount = this.reconnectCount + 1;
                this.ws_onMsgConnect();
            }, 5000);
        } else {
            ipcRenderer.send("wsReport", 14);
        }
    },
};

export default WSClient;


