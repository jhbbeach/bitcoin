'use strict';

import TradeDataFormat from './TradeDataFormat';

var FileFunc = {
    /**
     * 导出csv
     * @param obj
     * @param fileName
     */
    //obj格式
    //let obj = {
    //    titles:[
    //        {field: 'strategyId', name: '组合策略ID', isShow: true, isSort: true, width: 100},
    //        {field: 'strategyName', name: '组合策略名称', isShow: true, isSort: true, width: 100},
    //    ],
    //
    //    data:[
    //        {
    //            strategyId:12,
    //            strategyName:"策略",
    //            exchangeId:"12",
    //            instanceAmount:"12",
    //            maxAmount:"12",
    //        }
    //    ],
    //};

    exportCsv(obj, fileName){
        var titles = obj.titles;
        var data = obj.data;
        var str = [];
        for(let i = 0; i < titles.length; i++){
            if(titles[i].isShow){
                str.push(titles[i].keyName);
                if (i != titles.length - 1){
                    str.push(",");
                }
            }
        }
        str.push("\n");

        for(let i = 0; i < data.length; i++){
            var temp = [];
            for(let j = 0; j < titles.length; j++){
                if(titles[j].isShow){
                    let value = data[i][titles[j].titleKey];
                    switch (titles[j].titleKey){
                        case 'direction':
                            value = TradeDataFormat.getDirectionEnumToValue(value);
                            break;

                        case 'orderPriceType':
                            if (data[i].volumeCondition == "1" && data[i].timeCondition == "1"){
                                value = "FAK";
                            } else if (data[i].volumeCondition == "3" && data[i].timeCondition == "1"){
                                value = "FOK";
                            } else {
                                value = "普通单";
                            }
                            break;

                        case 'offsetFlag':
                            value = TradeDataFormat.getOffsetFlagEnumToValue(value);
                            break;

                        case 'hedgeFlag':
                            value = TradeDataFormat.getHedgeFlagEnumToValue(value);
                            break;

                        case 'timeCondition':
                            value = TradeDataFormat.getTimeConditionEnumToValue(value);
                            break;

                        case 'volumeCondition':
                            value = TradeDataFormat.getVolumeConditionEnumToValue(value);
                            break;

                        case 'forceCloseReason':
                            value = TradeDataFormat.getForceCloseReasonEnumToValue(value);
                            break;

                        case 'isAutoSuspend':
                            value = TradeDataFormat.getIsAutoSuspendEnumToValue(value);
                            break;

                        case 'businessType':
                            value = TradeDataFormat.getBusinessTypeEnumToValue(value);
                            break;

                        case 'orderSource':
                            value = TradeDataFormat.getOrderSourceEnumToValue(value);
                            break;

                        case 'orderStatus':
                            value = TradeDataFormat.getOrderStatusEnumToValue(value);
                            break;

                        case 'tradeType':
                            value = TradeDataFormat.getTradeTypeEnumToValue(value);
                            break;
                    }
                    temp.push(value);
                }
            }
            str.push(temp.join(",") + "\n");
        }
        var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str.join(""));
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = fileName + ".csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    },

    exportExcel(){

    }
};


export default FileFunc;
