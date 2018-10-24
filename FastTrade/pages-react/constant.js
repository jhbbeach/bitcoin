"use strict";
//全局常量
var Constant = {
    //火币
    HUOBI_DEPTH_STEP0: 'huobiDepthStep0',
    TRADE_DETAIL: 'tradeDetail',
};

Constant.openState = function(key){
    if(key == 'submitted'){
        return '已提交'
    }else if(key == 'partialfilled'){
        return '部分成交'
    }else if(key == 'cancelling'){
        return '正在取消'
    }
}

Constant.paserFloat = function(num){
    return parseFloat(num+'');
}

export default Constant;