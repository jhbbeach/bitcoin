'use strict';

var TradeDataFormat = {
    /**
     * 开平状态
     * @param value
     * @returns {*}
     */
    getOffsetFlagValueToEnum(value){
        switch (value){
            case '开仓':
                return '0';
            case '平仓':
                return '1';
            case '强平':
                return '2';
            case '平今':
                return '3';
            case '平昨':
                return '4';
            default:
                return '--';
        }
    },
    /**
     * 价格类型状态
     * @param value
     * @returns {*}
     */
    getPriceTypeFlagValueToEnum(value){
        switch (value){
            case '指定价':
                return '0';
            case '对手价':
                return '1';
            case '最优价':
                return '2';
            case '波动率':
                return '3';
            default:
                return '--';
        }
    },
    /**
     * 指令状态状态
     * @param value
     * @returns {*}
     */
    getStatusFlagValueToEnum(value){
        switch (value){
            case '进行中':
                return '0';
            case '已撤单':
                return '1';
            case '已完成':
                return '2';
            default:
                return '--';
        }
    },
    /**
     * 指令状态状态
     * @param value
     * @returns {*}
     */
    getStatusFlagEnumToValue(value){
        switch (value){
            case '0':
                return '进行中';
            case '1':
                return '已撤单';
            case '2':
                return '已完成';
            default:
                return '--';
        }
    },
    /**
     * 价格类型状态
     * @param value
     * @returns {*}
     */
    getPriceTypeFlagEnumToValue(value){
        switch (value){
            case '0':
                return '指定价';
            case '1':
                return '对手价';
            case '2':
                return '最优价';
            case '3':
                return '波动率';
            default:
                return '--';
        }
    },
    /**
     * 数量类型状态
     * @param value
     * @returns {*}
     */
    getVolumeTyoeEnumToValue(value){
        switch (value){
            case '0':
                return '普通单';
            case '1':
                return '冰山单';
            case '2':
                return '止盈止损';
            case '3':
                return '拆单';
            default:
                return '--';
        }
    },
    /**
     * 数量类型状态
     * @param value
     * @returns {*}
     */
    getVolumeTyoeValueToEnum(value){
        switch (value){
            case '普通单':
                return '0';
            case '冰山单':
                return '1';
            case '止盈止损':
                return '2';
            case '拆单':
                return '3';
            default:
                return '--';
        }
    },

    getOffsetFlagEnumToValue(value){
        switch (value){
            case '0':
                return '开仓';
            case '1':
                return '平仓';
            case '2':
                return '强平';
            case '3':
                return '平今';
            case '4':
                return '平昨';
            default:
                return '--';
        }
    },

    /**
     * 投机套保标志
     * @param value
     * @returns {*}
     */
    getHedgeFlagValueToEnum(value){
        switch (value){
            case '投机':
                return '1';
            case '套利':
                return '2';
            case '套保':
                return '3';
            case '做市商':
                return '4';
            case '备兑':
                return '5';
            default:
                return '--';
        }
    },

    getHedgeFlagEnumToValue(value){
        switch (value){
            case '1':
                return '投机';
            case '2':
                return '套利';
            case '3':
                return '套保';
            case '4':
                return '做市商';
            case '5':
                return '备兑';
            default:
                return '--';
        }
    },

    /**
     * 获取报单状态
     * @param orderStatus
     * @returns {*}
     */
    getOrderStatusEnumToValue(orderStatus){
        switch (orderStatus){
            case 'a':
                return '未知类型';
            case '0':
                return '全部成交';
            case '1':
                return '部分成交还在队列中';
            case '2':
                return '部分成交不在队列中';
            case '3':
                return '未成交还在队列中';
            case '4':
                return '未成交不在队列中';
            case '5':
                return '撤单(不在队列中)';
            case '6':
                return '订单已报入交易所未应答';
            case '7':
                return '部分撤单还在队列中';
            case '8':
                return '部分成交部分撤单还在队列中';
            case '9':
                return '待报入';
            case 'B':
                return '投顾报单';
            case 'C':
                return '投资经理驳回';
            case 'D':
                return '投资经理通过';
            case 'E':
                return '交易员已报入';
            case 'F':
                return '交易员驳回';
            case 'G':
                return '投顾经理保单';
            default:
                return '--';
        }
    },

    /**
     * 获取报单类型
     * @param type
     * @returns {*}
     */
    getOrderPriceTypeEnumToValue(type){
        switch (type){
            case '1':
                return '任意价';
            case '2':
                return '限价';
            case '3':
                return '最优价';
            case '4':
                return '五档价';
            case '5':
                return '对方最优价格';
            case '6':
                return '本方最优价格';
            case '7':
                return '最优五档即时成交剩余撤销';
            case '8':
                return 'FAK';
            case '9':
                return 'FOK';
            case 'a':
                return '最优五档即时成交剩余转限价';
            default:
                return '--';
        }
    },

    /**
     * 获取买卖方向
     * @param direction
     * @returns {*}
     */
    getDirectionEnumToValue(direction){
        switch (direction){
            case '0':
                return '买';
            case '1':
                return '卖';
            default:
                return '--';
        }
    },

    getDirectionValueToEnum(direction){
        switch (direction){
            case '买':
                return '0';
            case '卖':
                return '1';
            default:
                return '--';
        }
    },


    /**
     * 获取有效期类型
     * @param timeCondition
     */
    getTimeConditionEnumToValue(timeCondition){
        switch (timeCondition){
            case '1':
                return '立即完成; 否则撤销';
            case '2':
                return '本节有效';
            case '3':
                return '当日有效';
            case '4':
                return '指定日期前有效';
            case '5':
                return '撤销前有效';
            case '6':
                return '集合竞价有效';
            default:
                return '--';
        }
    },

    /**
     * 获取成交量类型
     * @param volumeCondition
     */
    getVolumeConditionEnumToValue(volumeCondition){
        switch (volumeCondition){
            case '1':
                return '任何数量';
            case '2':
                return '最小数量';
            case '3':
                return '全部数量';
            default:
                return '--';
        }
    },

    /**
     * 获取强平原因
     * @param forceCloseReason
     * @returns {*}
     */
    getForceCloseReasonEnumToValue(forceCloseReason){
        switch (forceCloseReason){
            case '0':
                return '非强平';
            case '1':
                return '资金不足';
            case '2':
                return '客户超仓';
            case '3':
                return '会员超仓';
            case '4':
                return '持仓非整数倍';
            default:
                return '--';
        }
    },

    /**
     * 获取自动挂起标志
     * @param isAutoSuspend
     * @returns {*}
     */
    getIsAutoSuspendEnumToValue(isAutoSuspend){
        switch (isAutoSuspend){
            case 0:
                return '否';
            case 1:
                return '是';
            default:
                return '--';
        }
    },

    getBusinessTypeEnumToValue(businessType){
        switch (businessType){
            case '1':
                return '普通';
            case '3':
                return '申赎';
            case 'a':
                return '套利组合单';
            case 'b':
                return '网上投票';
            case 'c':
                return '行权';
            case 'd':
                return '金交所中立仓申报';
            case 'e':
                return '金交所递延交割申报';
            case 'f':
                return '互换定单';
            case 'g':
                return '质押';
            case 'h':
                return '合并分拆';
            case 'i':
                return '转股';
            case 'j':
                return '回售';
            case 'k':
                return '债券出入库';
            default:
                return '--';
        }
    },

    /**
     * 获取报单来源
     * @param orderSource
     */
    getOrderSourceEnumToValue(orderSource){
        switch (orderSource){
            case '0':
                return '来自参与者';
            case '1':
                return '来自管理员';
            default:
                return '--';
        }
    },

    /**
     * 获取成交类型
     * @param tradeType
     */
    getTradeTypeEnumToValue(tradeType){
        switch (tradeType){
            case '1':
                return '普通成交';
            case '2':
                return '组合成交';
            case '3':
                return '指令单成交';
            case '4':
                return '场外成交';
            case '5':
                return '指令单组合成交';
            default:
                return '--';
        }
    },

    /**
     * 格式化价格
     * @param data
     * @param key1
     * @param key2
     * @returns {*}
     */
    formatPrice(data, key1, key2){
        if (data){
            let value2 = data[key2];
            let value1 = data[key1];
            if (value1 && value2){
                let array = (value2 + "").split(".");
                if (array.length > 1){
                    return value1.toFixed(array[1].length);
                }
            }
            return value1 || value1 == 0 ? value1 : "--";
        }
        return "--";

    },

    /**
     * 格式化小数位
     * @param data
     * @param key1
     * @param fixedValue
     * @returns {*}
     */
    formatThouthen(s,n){
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        let  l = s.split(".")[0].split("").reverse();
        let r = s.split(".")[1];
        let t = "";
        for (let i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        let res = t.split("").reverse().join("");
        if(r){
            res = t.split("").reverse().join("") + "." + r;
        }
        res = res.replace(/^-,/,"-");  
        return res;
    },
    formatPriceForFixed(data, key1, fixedValue){
        if (data){
            let value1 = data[key1];
            if (value1){
                if (fixedValue > 0){
                    return value1.toFixed(fixedValue);
                }
            }
            return (value1 || value1 == 0) ? value1 : "--";
        }
        return "--";
    },
    formatPriceForFixedTwo(data, key1, fixedValue){
        if (data){
            let value1 = data[key1];
            if (value1){
                if (fixedValue > 0){
                    return this.formatThouthen(value1,fixedValue);
                }
            }
            return (value1 || value1 == 0) ? value1 : "--";
        }
        return "--";
    },

    /**
     * 格式化vol
     * @param data
     * @param key
     * @param defaultValue
     * @returns {*}
     */
    formatVol(data, key, defaultValue){
        if (!defaultValue){
            defaultValue = defaultValue == 0 ? defaultValue : "--";
        }
        if (data){
            let value = data[key];
            if (value || value == 0){
                return (value * 100).toFixed(2) + "%";
            }
        }
        return defaultValue;
    },

    /**
     * 格式化一般数据
     * @param data
     * @param key
     * @param defaultValue
     */
    formatData(data, key, defaultValue){
        if (!defaultValue){
            defaultValue = defaultValue == 0 ? defaultValue : "--";
        }
        if (data){
            let value = data[key];
            if (value || value == 0){
                if ((value + "").match("e")){
                    return defaultValue;
                }
                if(key == "upperLimitPrice" || key == "lowerLimitPrice")
                    return value.toFixed(2);
                else
                    return value;
            }
        }
        return defaultValue;
    },

    /**
     * 格式化greeks数据
     * @param data
     * @param key
     * @param defaultValue
     * @returns {*}
     */
    formatGreeks(data, key, defaultValue){
        if (!defaultValue){
            defaultValue = defaultValue == 0 ? defaultValue : "--";
        }
        if (data){
            let value = data[key];
            if (value || value == 0){
                return value.toFixed(4);
            }
        }
        return defaultValue;
    },
    /**
     * 格式化价格NaN
     * @param data
     * @returns {*}
     */
    formatPriceNaN(data){
        if(!data || data > 1000000000 || data < -100000000){
            data = data == 0 ? data : "--";
            return data;
        }else if(data || data === 0){
            return data;
        }
    },
    /**
     * 格式化数量
     * @param data
     * @returns {*}
     */
    formatNumberNaN(data,key){
        if(data){
            if(isNaN(data[key]))
                return "--"
            else
            return data[key];
        }
    }
};




export default TradeDataFormat;
