/**
 * 账户管理
 */
'use strict';
const { BrowserWindow } = require('electron');
class WSReport {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.optionalReturnWindowIds = [];
        this.theoryPriceReturnWindowIds = [];
        this.markerStrategyReturnWindowIds = [];
        this.futureMakerReturnWindowIds = [];
        this.orderReturnWindowIds = [];
        this.atmReturnWindowIds = [];
        this.tradeReturnWindowIds = [];
        this.strategyReturnWindowIds = [];
        this.quotaReturnWindowIds = [];
        this.positionReturnWindowIds = [];
        this.portfolioBalanceReturnWindowIds = [];
        this.quoteTotalTradeWindowIds = [];
        this.quoteTotalTradePositionWindowIds = [];
        this.totalSubscribeWindowIds = [];
        this.userSwitchWindowId = -1;
    }

    wsReport(messageType, data1, data2) {
        switch (messageType) {
            //委托订阅
            case 1:
                this.orderReturnSubscribe(data1, data2);
                break;

            //成交订阅
            case 2:
                this.tradeReturnSubscribe(data1, data2);
                break;

            //行情订阅
            case 3:
                this.optionalSubscribe(data1, data2);
                break;

            //重连通知
            case 4:
                this.wsReconnect();
                break;

            //委托推送
            case 5:
                this.orderReturnReceive(data1);
                break;

            //成交推送
            case 6:
                this.tradeReturnReceive(data1);
                break;

            //行情推送
            case 7:
                this.optionalReceive(data1);
                break;

            //删除行情订阅
            case 8:
                this.deleteOptionalSubscribe(data1);
                break;

            //指令订阅
            case 9:
                this.instructionSubscribe(data1, data2);
                break;

            //指令推送
            case 10:
                this.instructionReceive(data1);
                break;

            //指标订阅
            case 11:
                this.quotaReturnSubscribe(data1, data2);
                break;

            //指标推送
            case 12:
                this.quotaReturnReceive(data1);
                break;

            //删除指标订阅
            case 13:
                this.deleteQuotaReturnSubscribe(data1);
                break;

            //ws重连超过最大次数
            case 14:
                this.mainWindow.getWindow().send("crossMaxReconnectCount");
                break;

            //持仓订阅
            case 15:
                this.positionReturnSubscribe(data1, data2);
                break;

            //持仓推送
            case 16:
                this.positionReturnReceive(data1);
                break;

            //资金订阅
            case 17:
                this.balanceSubscribe(data1, data2);
                break;

            //资金推送
            case 18:
                this.balanceReceive(data1);
                break;
            //理论价行情订阅
            case 19:
                this.theoryPriceSubscribe(data1, data2);
                break;
            //理论价行情推送
            case 20:
                this.theoryPriceReceive(data1);
                break;
            //删除理论价行情订阅
            case 21:
                this.deleteTheoryPriceSubscribe(data1);
                break;
            //做市委托回报价格订阅
            case 30:
                this.quoteTotalTradePriceSubscribe(data1, data2);
                break;
            //做市委托回报持仓订阅
            case 31:
                this.quoteTotalTradePositionSubscribe(data1, data2);
                break;
            //做市委托回报价格接收
            case 32:
                this.quoteTotalTradePriceReceive(data1);
                break;
            //做市委托回报持仓接收
            case 33:
                this.quoteTotalTradePositionReceive(data1);
                break;

            //做市策略设置订阅
            case 24:
                this.markerStrategySubscribe(data1, data2);
                break;

            //做市策略设置接收
            case 25:
                this.markerStrategyReceive(data1);
                break;

            //删除做市策略设置订阅
            case 26:
                this.deleteMarkerStrategySubscribe(data1);
                break;

            //用户开关订阅
            case 27:
                this.userSwitchSubscribe(data1, data2);
                break;

            //用户开关订阅接收
            case 28:
                this.userSwitchReceive(data1);
                break;
            //atm订阅
            case 34:
                this.atmInfolSubscribe(data1, data2);
                break;
            //删除atm订阅
            case 35:
                this.DeleteatmInfolSubscribe(data1);
                break;
            //atm订阅接收
            case 36:
                this.atmInfoReceive(data1);
                break;
            //期货做市订阅
            case 38:
                this.futureMakerHedgeSubscribe(data1, data2);
                break;
            //期货做市接收
            case 39:
                this.futureMakerHedgeStatusReceive(data1);
                break;
        }
    }

    setMainWindow(mainWindow){
        this.mainWindow = mainWindow;
    }

    /**
     * 委托订阅
     * @param data1
     * @param data2
     */
    orderReturnSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data1 && data2 && data2 !== -1) {
                this.mainWindow.getWindow().send('orderReturnSubscribe', data1);
                let windowId = Number(data2);
                if (this.orderReturnWindowIds.indexOf(windowId) == -1) {
                    this.orderReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "orderReturnSubscribe", data1, data2);
            }
        }
    }
    /**
     * atm订阅
     * @param data1
     * @param data2
     */
    atmInfolSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data1 && data2 && data2 !== -1) {
                this.mainWindow.getWindow().send('atmInfoReturnSubscribe', data1);
                let windowId = Number(data2);
                if (this.atmReturnWindowIds.indexOf(windowId) == -1) {
                    this.atmReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "atmInfoReturnSubscribe", data1, data2);
            }
        }
    }

    /**
     * 委托回报接收
     * @param data1
     */
    orderReturnReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.orderReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.orderReturnWindowIds[i]);
                if (window != null) {
                    window.send('orderReturn', data1)
                }
            }
        }
    }

    /**
     * 成交回报订阅
     * @param data1
     * @param data2
     */
    tradeReturnSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data1 && data2 && data2 !== -1) {
                this.mainWindow.getWindow().send('tradeReturnSubscribe', data1);
                let windowId = Number(data2);
                if (this.tradeReturnWindowIds.indexOf(windowId) == -1) {
                    this.tradeReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "tradeReturnSubscribe", data1, data2);
            }
        }
    }

    tradeReturnReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.tradeReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.tradeReturnWindowIds[i]);
                if (window != null) {
                    window.send('tradeReturn', data1)
                }
            }
        }
    }


    /**
     * 行情订阅
     * @param data1
     * @param data2
     */
    optionalSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data1 && data2 && data2 !== -1) {
                this.mainWindow.getWindow().send('optionSubscribe', data1);
                let windowId = Number(data2);
                if (this.optionalReturnWindowIds.indexOf(windowId) == -1) {
                    this.optionalReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "optionalSubscribe", data1, data2);
            }
        }
    }

    /**
     * 行情接收
     * @param data1
     */
    optionalReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.optionalReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.optionalReturnWindowIds[i]);
                if (window != null) {
                    window.send('optional', data1);
                }
            }
        }
    }
    /**
     * atmInfo接收
     * @param data1
     */
    atmInfoReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.atmReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.atmReturnWindowIds[i]);
                if (window != null) {
                    window.send('atmInfoReturn', data1);
                }
            }
        }
    }
    /**
     * 期货做市商接收
     * @param data1
     */
    futureMakerHedgeStatusReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.futureMakerReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.futureMakerReturnWindowIds[i]);
                if (window != null) {
                    window.send('futureMakerHedgeStatusReturn', data1);
                }
            }
        }
    }

    /**
     * 删除atm行情订阅
     * @param data1
     */
    DeleteatmInfolSubscribe(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            this.mainWindow.getWindow().send('deleteAtmSubscribe', data1);
        }
    }
    /**
     * 删除行情订阅
     * @param data1
     */
    deleteOptionalSubscribe(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            this.mainWindow.getWindow().send('deleteOptionalSubscribe', data1);
        }
    }


    /**
     * 重连
     */
    wsReconnect(){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.totalSubscribeWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.totalSubscribeWindowIds[i]);
                if (window != null) {
                    window.send('wsReconnect');
                }
            }
        }
    }

    /**
     * 指令订阅
     * @param data1
     * @param data2
     */
    instructionSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('instructionSubscribe', data1);
                let windowId = Number(data2);
                if (this.strategyReturnWindowIds.indexOf(windowId) == -1) {
                    this.strategyReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "instructionSubscribe", data1, data2);
            }
        }
    }

    /**
     * 指令接收
     * @param data1
     */
    instructionReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.strategyReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.strategyReturnWindowIds[i]);
                if (window != null) {
                    window.send('instructionReturn', data1);
                }
            }
        }
    }

    /**
     * 指标订阅
     * @param data1
     * @param data2
     */
    quotaReturnSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('quotaReturnSubscribe', data1);
                let windowId = Number(data2);
                if (this.quotaReturnWindowIds.indexOf(windowId) == -1) {
                    this.quotaReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "quotaReturnSubscribe", data1, data2);
            }
        }
    }

    /**
     * 指标接收
     * @param data1
     */
    quotaReturnReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.quotaReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.quotaReturnWindowIds[i]);
                if (window != null) {
                    window.send('quotaReturn', data1);
                }
            }
        }
    }

    /**
     * 删除指标订阅
     * @param data1
     */
    deleteQuotaReturnSubscribe(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            this.mainWindow.getWindow().send('deleteQuotaReturnSubscribe', data1);
        }
    }

    /**
     * 持仓订阅
     * @param data1
     * @param data2
     */
    positionReturnSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('positionReturnSubscribe', data1);
                let windowId = Number(data2);
                if (this.positionReturnWindowIds.indexOf(windowId) == -1) {
                    this.positionReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "positionReturnSubscribe", data1, data2);
            }
        }
    }

    /**
     * 持仓接收
     * @param data1
     */
    positionReturnReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.positionReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.positionReturnWindowIds[i]);
                if (window != null) {
                    window.send('positionReturn', data1);
                }
            }
        }
    }

    /**
     * 资金订阅
     * @param data1
     * @param data2
     */
    balanceSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('portfolioBalanceSubscribe', data1);
                let windowId = Number(data2);
                if (this.portfolioBalanceReturnWindowIds.indexOf(windowId) == -1) {
                    this.portfolioBalanceReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "portfolioBalanceSubscribe", data1, data2);
            }
        }
    }

    /**
     * 资金订阅接收
     * @param data1
     */
    balanceReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.portfolioBalanceReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.portfolioBalanceReturnWindowIds[i]);
                if (window != null) {
                    window.send('portfolioBalanceReturn', data1);
                }
            }
        }
    }

    /**
     * 理论价订阅
     * @param data1
     * @param data2
     */
    theoryPriceSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('theoryPriceSubscribe', data1);
                let windowId = Number(data2);
                if (this.theoryPriceReturnWindowIds.indexOf(windowId) == -1) {
                    this.theoryPriceReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "theoryPriceSubscribe", data1, data2);
            }
        }
    }

    /**
     * 理论价接收
     * @param data1
     */
    theoryPriceReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.theoryPriceReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.theoryPriceReturnWindowIds[i]);
                if (window != null) {
                    window.send('theoryPriceReturn', data1);
                }
            }
        }
    }

    /**
     * 删除理论价订阅
     * @param data1
     */
    deleteTheoryPriceSubscribe(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            this.mainWindow.getWindow().send('deleteTheoryPriceSubscribe', data1);
        }
    }

    /**
     * 做市委托回报价格订阅
     * @param data1
     * @param data2
     */
    quoteTotalTradePriceSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('quoteTotalTradePriceSubscribe', data1);
                let windowId = Number(data2);
                if (this.quoteTotalTradeWindowIds.indexOf(windowId) == -1) {
                    this.quoteTotalTradeWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "quoteTotalTradePriceSubscribe", data1, data2);
            }
        }
    }
    /**
     * 做市委托回报持仓订阅
     * @param data1
     * @param data2
     */
    quoteTotalTradePositionSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('quoteTotalTradePositionSubscribe', data1);
                let windowId = Number(data2);
                if (this.quoteTotalTradePositionWindowIds.indexOf(windowId) == -1) {
                    this.quoteTotalTradePositionWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "quoteTotalTradePositionSubscribe", data1, data2);
            }
        }
    }

    /**
     * 做市委托回报价格接收
     * @param data1
     */
    quoteTotalTradePriceReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.quoteTotalTradeWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.quoteTotalTradeWindowIds[i]);
                if (window != null) {
                    window.send('quoteTotalTradePriceReturn', data1);
                }
            }
        }
    }
    /**
     * 做市委托回报持仓接收
     * @param data1
     */
    quoteTotalTradePositionReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.quoteTotalTradePositionWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.quoteTotalTradePositionWindowIds[i]);
                if (window != null) {
                    window.send('quoteTotalTradePositionReturn', data1);
                }
            }
        }
    }

    /**
     * 做市策略设置订阅
     * @param data1
     * @param data2
     */
    markerStrategySubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('markerStrategySubscribe', data1);
                let windowId = Number(data2);
                if (this.markerStrategyReturnWindowIds.indexOf(windowId) == -1) {
                    this.markerStrategyReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "markerStrategySubscribe", data1, data2);
            }
        }
    }

    /**
     * 期货对冲报价订阅
     * @param data1
     * @param data2
     */
    futureMakerHedgeSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('futureMakerHedgeStatusSubscribe', data1);
                let windowId = Number(data2);
                if (this.futureMakerReturnWindowIds.indexOf(windowId) == -1) {
                    this.futureMakerReturnWindowIds.push(windowId);
                }
                if (this.totalSubscribeWindowIds.indexOf(windowId) == -1) {
                    this.totalSubscribeWindowIds.push(windowId);
                }
            } else {
                this.mainWindow.getWindow().send("subscribeError", "futureMakerHedgeStatusSubscribe", data1, data2);
            }
        }
    }

    /**
     * 做市策略设置接收
     * @param data1
     */
    markerStrategyReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            for (let i = 0; i < this.markerStrategyReturnWindowIds.length; i++) {
                let window = BrowserWindow.fromId(this.markerStrategyReturnWindowIds[i]);
                if (window != null) {
                    window.send('markerStrategyReturn', data1);
                }
            }
        }
    }

    /**
     * 删除做市策略设置订阅
     * @param data1
     */
    deleteMarkerStrategySubscribe(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            this.mainWindow.getWindow().send('deleteMarkerStrategySubscribe', data1);
        }
    }

    /**
     * user开关订阅
     * @param data1
     * @param data2
     */
    userSwitchSubscribe(data1, data2){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            if (data2) {
                this.mainWindow.getWindow().send('userSwitchSubscribe', data1);
                this.userSwitchWindowId = Number(data2);
            } else {
                this.mainWindow.getWindow().send("subscribeError", "userSwitchSubscribe", data1, data2);
            }
        }
    }

    /**
     * user开关订阅接收
     * @param data1
     */
    userSwitchReceive(data1){
        if (this.mainWindow && this.mainWindow.getWindow()) {
            let window = BrowserWindow.fromId(this.userSwitchWindowId);
            if (window != null) {
                window.send('userSwitchReturn', data1);
            }
        }
    }

}

module.exports = WSReport;