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

export default TradeService;