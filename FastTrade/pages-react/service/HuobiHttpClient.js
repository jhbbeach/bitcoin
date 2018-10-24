'use strict';
var HuobiHttpClient = {};
import request from "superagent"
module.exports = HuobiHttpClient;

/**
 * 内部对象，仅供内部调用
 * */
HuobiHttpClient.internal = {};
HuobiHttpClient.restfulservice ={};
HuobiHttpClient.service ={};
const URL = 'https://api.huobipro.com';

/**
 * 发起请求
 * serviceRequest.request1('myService', 'myFunc', param1, param2, param3, ...);
 * @param {string} serviceName 服务名
 * @param {string} funcName 方法名
 * @param {any...} 远程服务方法参数
 * @param {function} callback 回调函数
 * */
HuobiHttpClient.service.request = function (serviceName, funcName , param ,callback) {
    var url = URL + '/' + serviceName + '/' + funcName;
    var params = HuobiHttpClient.internal.getParams(param);
    //HuobiHttpClient.internal.sendPost(url, data, callback);
    HuobiHttpClient.internal.sendGet(url, params, callback);
};

/**
 * 发起POST请求
 * @param {string} data 要post的数据
 * */
HuobiHttpClient.internal.sendPost = function (url, data, callback) {
    HuobiHttpClient.internal.request(url, 'POST', data, callback);
};

/**
 * 发起POST请求
 * @param {string} data 要post的数据
 * */
HuobiHttpClient.internal.sendGet = function (url, data, callback) {
    HuobiHttpClient.internal.request(url, 'GET', data, callback);
};

HuobiHttpClient.internal.request = function (url, method, data, callback) {
    var bodyData = data;
    if (data !== null) {
        if (method === "GET" || method === "PUT" || method === "DELETE") {
            url = url + "?" + data;
            bodyData = null;
        }
    }
    request(method, url)
        .timeout(30000)
        .withCredentials()
        .set('Accept', 'text/plain;')
        .set('Accept-Encoding', 'deflate; g-zip')
        .set('Cache-Control', 'no-cache')
        .set('Connection', 'keep-alive')
        .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
        .send(bodyData)
        .end(function (err, res) {

            // 网络访问的错误处理
            if (err != null) {
                console.error(err);
                if (typeof callback == 'function') {
                    callback(-1, 'network error');
                }

                return
            }
            // 正常处理
            var errorCode = 200;
            try {
                var code = parseInt(res.xhr.getResponseHeader('error_code'))
                if ((code + "") != "NaN") {
                    errorCode = code
                }
            } catch (e) {
                console.error(e)
            }
            if (errorCode === 200) {
                // success
                var rawData = res.text;
                if (rawData != '') {
                    rawData = JSON.parse(rawData);
                }
                var errCode = 0;
                var errMsg = 'succeed';
                if (typeof callback == 'function') {
                    try {
                        callback(errCode, errMsg, rawData);
                    } catch (error) {
                        console.error(error);
                    }

                }
            } else {
                console.log('error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            }

        });
}

HuobiHttpClient.internal.getParams = function (obj) {
    let Str = '';
    for(let t in obj){
        if(Str != ''){
            Str += '&' + t + '=' + obj[t];
        }else{
            Str += t + '=' + obj[t];
        }
    }
    return Str;
}