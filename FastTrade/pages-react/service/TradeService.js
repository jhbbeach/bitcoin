/**
 * 登入Service
 * Created by lihu on 2016/6/12.
 */

'use strict';
import HuobiHttpClient from "./HttpClient.js";




var TradeService = {};


TradeService.order = function(obj) {
    return new Promise(function(resolve, reject) {
        HuobiHttpClient.service.request(
            'huobiApi',
            'order',
            obj,
            function(errCode, errMsg, result) {
                var error = {
                    errorCode: errCode,
                    errorMsg: errMsg
                };
                // errCode < 0 为系统级异常 errCode > 0 为业务级异常
                if (errCode > 0 || errCode < 0) {
                    //console.error(errCode + ': ' + errMsg);
                    reject(error);
                    return;
                }
                resolve(result);
            }
        );
    })
};

TradeService.findAccountByExchange = function(obj) {
    return new Promise(function(resolve, reject) {
        HuobiHttpClient.service.request(
            'accountManage',
            'findAccountByExchange',
            obj,
            function(errCode, errMsg, result) {
                var error = {
                    errorCode: errCode,
                    errorMsg: errMsg
                };
                // errCode < 0 为系统级异常 errCode > 0 为业务级异常
                if (errCode > 0 || errCode < 0) {
                    //console.error(errCode + ': ' + errMsg);
                    reject(error);
                    return;
                }
                resolve(result);
            }
        );
    })
};

/**
 * 获取所有交易对
 * @param {*} obj 
 */
TradeService.getSymbols = function(obj) {
    return new Promise(function(resolve, reject) {
        HuobiHttpClient.service.request(
            'huobiApi',
            'getSymbols',
            obj,
            function(errCode, errMsg, result) {
                var error = {
                    errorCode: errCode,
                    errorMsg: errMsg
                };
                // errCode < 0 为系统级异常 errCode > 0 为业务级异常
                if (errCode > 0 || errCode < 0) {
                    //console.error(errCode + ': ' + errMsg);
                    reject(error);
                    return;
                }
                resolve(result);
            }
        );
    })
};

/**
 * 获取未成交单
 * @param {*} obj 
 */
TradeService.openOrders = function(obj) {
    return new Promise(function(resolve, reject) {
        HuobiHttpClient.service.request(
            'huobiApi',
            'openOrders',
            obj,
            function(errCode, errMsg, result) {
                var error = {
                    errorCode: errCode,
                    errorMsg: errMsg
                };
                // errCode < 0 为系统级异常 errCode > 0 为业务级异常
                if (errCode > 0 || errCode < 0) {
                    //console.error(errCode + ': ' + errMsg);
                    reject(error);
                    return;
                }
                resolve(result);
            }
        );
    })
};

/**
 * 撤单
 * @param {*} obj 
 */
TradeService.submitcancel = function(obj) {
    return new Promise(function(resolve, reject) {
        HuobiHttpClient.service.request(
            'huobiApi',
            'submitcancel',
            obj,
            function(errCode, errMsg, result) {
                var error = {
                    errorCode: errCode,
                    errorMsg: errMsg
                };
                // errCode < 0 为系统级异常 errCode > 0 为业务级异常
                if (errCode > 0 || errCode < 0) {
                    //console.error(errCode + ': ' + errMsg);
                    reject(error);
                    return;
                }
                resolve(result);
            }
        );
    })
};

/**
 * 查询盈亏比
 * @param {*} obj 
 */
TradeService.balancePersent = function(obj) {
    return new Promise(function(resolve, reject) {
        HuobiHttpClient.service.request(
            'huobiApi',
            'balancePersent',
            obj,
            function(errCode, errMsg, result) {
                var error = {
                    errorCode: errCode,
                    errorMsg: errMsg
                };
                // errCode < 0 为系统级异常 errCode > 0 为业务级异常
                if (errCode > 0 || errCode < 0) {
                    //console.error(errCode + ': ' + errMsg);
                    reject(error);
                    return;
                }
                resolve(result);
            }
        );
    })
};


export default TradeService;