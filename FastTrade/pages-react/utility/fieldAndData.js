'use strict';
/**表头所有字段、特殊字段转换,包括:
 *  1：委托表头、委托特殊字段、委托特殊字段转换、
 *  2：成交表头、成交特殊字段、特殊字段转换同委托、
 *  3：持仓表头、持仓特殊字段、特殊字段转换同委托、
 *  4：资金表头、资金无特殊字段、
 *  5：指令表头、指令特殊字段、指令特殊字段转换、
 *
 *  FieldAndData.specialField   特殊字段
 *  FieldAndData.titles         所有类型表头
 *  FieldAndData.func           转换函数
 *
 */

var FieldAndData = {};
//特殊字段
FieldAndData.specialField = {};
//委托特殊字段
FieldAndData.specialField.orderSpecialKey = {
    //报单类型
    OrderPriceType:{1:"任意价", 2:"限价", 3: "最优价", 4 : "五档价"},
    //买卖方向
    Direction:{0:"买", 1:"卖"},
    //投机套保标志
    HedgeFlag:{1:"投机", 2:"套保", 3:"套利", 4:"做市商"},
    //有效期类型
    TimeCondition:{1:"立即完成，否则撤销", 2:"本节有效", 3:"当日有效", 4:"指定日期前有效", 5:"撤销前有效", 6:"集合竞价有效"},
    //成交量类型
    VolumeCondition:{1:"任何数量", 2:"最小数量", 3:"全部数量"},
    //强平原因
    ForceCloseReason:{0:"非强平", 1:"资金不足", 2:"客户超仓", 3:"会员超仓", 4:"持仓非整数倍", 5: "违规", 6:"其他", 7:"自然人临近交割", 8:"客户套保超仓"},
    //报单来源
    OrderSource:{0:"来自参与者", 1:"来自管理员"},
    //报单状态
    OrderStatus:{
        a:"未知",
        0:"初始状态",
        1:"应答失败(未成交不在队列中)",
        2:"应答成功(未成交还在队列中)",
        3:"确认成功(未成交还在队列中)",
        4:"部分成交还在队列中",
        5:"部分成交不在队列中",
        6:"全部成交",
        7:"撤单"
    }

};

//指令特殊字段
FieldAndData.specialField.instructSpecialKey = {
    InstructionType:{1:"冰山", 2:"随机冰山", 3:"拆单"},
    OffsetFlag:{0:"开仓", 1:"平仓", 2:"强平", 3:"平今", 4:"平昨", 5:"自动"},
    Direction:{0:"买", 1:"卖"},
    HedgeFlag:{1:"投机", 2:"套利", 3:"套保", 4:"做市商"},
    OrderType:{1:"限价", 2:"FOK", 3:"FAK"},
    InstructionStatus:{1:"进行中", 2:"暂停", 3:"完成", 4:"撤销"},
    PriceType:{1:"价格", 2:"波动率"}
};

//指令类型下拉字段
FieldAndData.specialField.instructionTypes = [
    {key: 'all',value: '所有指令类型'},
    {key: '1',  value: '冰山指令'},
    {key: '2',  value: '随机冰山'},
    {key: '3',  value: '拆单'}
];

//指令状态下拉字段
FieldAndData.specialField.instructionStatus = [
    {key: 'all', value: '所有指令状态'},
    {key: '1', value: '进行中'},
    {key: '2', value: '暂停'},
    {key: '3', value: '完成'},
    {key: '4', value: '撤销'}
];

//所有类型表头
FieldAndData.titles = {};
//委托表头
FieldAndData.titles.orderTitles = [
    {field: 'ExchangeID', name: '交易所代码', isShow: true, isSort: true, width: 100},
    {field: 'OrderID', name: '报单编号', isShow: true, isSort: true, width: 100},
    {field: 'InvestorID', name: '投资者编号', isShow: true, isSort: true, width: 100},
    {field: 'UserID', name: '用户代码', isShow: true, isSort: true, width: 100},
    {field: 'PortfolioID', name: '组合代码', isShow: true, isSort: true, width: 100},
    {field: 'InstrumentID', name: '合约代码', isShow: true, isSort: true, width: 100},
    {field: 'UserOrderLocalID', name: '用户本地报单号', isShow: true, isSort: true, width: 100},
    {field: 'OrderPriceType', name: '报单类型', isShow: true, isSort: true, width: 100},
    {field: 'Direction', name: '买卖方向', isShow: true, isSort: true, width: 100},
    {field: 'OffsetFlag', name: '开平标志', isShow: true, isSort: true, width: 100},
    {field: 'HedgeFlag', name: '投机套保标志', isShow: true, isSort: true, width: 100},
    {field: 'LimitPrice', name: '价格', isShow: true, isSort: true, width: 100},
    {field: 'Volume', name: '数量', isShow: true, isSort: true, width: 100},
    {field: 'TimeCondition', name: '有效期类型', isShow: true, isSort: true, width: 100},
    {field: 'GTDDate', name: 'GTD日期', isShow: true, isSort: true, width: 100},
    {field: 'VolumeCondition', name: '成交量类型', isShow: true, isSort: true, width: 100},
    {field: 'MinVolume', name: '最小成交量', isShow: true, isSort: true, width: 100},
    {field: 'StopPrice', name: '止损价', isShow: true, isSort: true, width: 100},
    {field: 'ForceCloseReason', name: '强平原因', isShow: true, isSort: true, width: 100},
    {field: 'IsAutoSuspend', name: '自动挂起标志', isShow: true, isSort: true, width: 100},
    {field: 'BusinessUnit', name: '业务单元', isShow: true, isSort: true, width: 100},
    {field: 'UserCustom', name: '用户自定义域 ', isShow: true, isSort: true, width: 100},
    {field: 'TradingDay', name: '交易日 ', isShow: true, isSort: true, width: 100},
    {field: 'BrokerID', name: '经纪公司编号 ', isShow: true, isSort: true, width: 100},
    {field: 'InstructionID', name: '指令编号 ', isShow: true, isSort: true, width: 100},
    {field: 'ExchClientID', name: '股东代码 ', isShow: true, isSort: true, width: 100},
    {field: 'InsertTime', name: '插入时间 ', isShow: true, isSort: true, width: 100},
    {field: 'ExchLocalOrderID', name: '交易所本地报单编号 ', isShow: true, isSort: true, width: 100},
    {field: 'OrderSource', name: '报单来源 ', isShow: true, isSort: true, width: 100},
    {field: 'OrderStatus', name: '报单状态 ', isShow: true, isSort: true, width: 100},
    {field: 'CancelTime', name: '撤销时间 ', isShow: true, isSort: true, width: 100},
    {field: 'CancelUserID', name: '撤单用户编号 ', isShow: true, isSort: true, width: 100},
    {field: 'VolumeTraded', name: '今成交数量 ', isShow: true, isSort: true, width: 100},
    {field: 'VolumeRemain', name: '剩余数量 ', isShow: true, isSort: true, width: 100},
    {field: 'OrderBatch', name: '报单批号 ', isShow: true, isSort: true, width: 100},
    {field: 'IsAuto', name: '自动报单标志 ', isShow: true, isSort: true, width: 100}

];

//成交表头
FieldAndData.titles.tradeTitles = [
    {field: 'BrokerID', name: '经纪公司编号', isShow: true, isSort: true, width: 100},
    {field: 'ExchangeID', name: '交易所代码', isShow: true, isSort: true, width: 100},
    {field: 'TradingDay', name: '交易日', isShow: true, isSort: true, width: 100},
    {field: 'InvestorID', name: '投资者编号', isShow: true, isSort: true, width: 100},
    {field: 'ClientID', name: '客户号', isShow: true, isSort: true, width: 100},
    {field: 'UserID', name: '用户代码', isShow: true, isSort: true, width: 100},
    {field: 'PortfolioID', name: '组合代码', isShow: true, isSort: true, width: 100},
    {field: 'TradeID', name: '成交编号', isShow: true, isSort: true, width: 100},
    {field: 'OrderID', name: '系统报单编号', isShow: true, isSort: true, width: 100},
    {field: 'InstrumentID', name: '合约代码', isShow: true, isSort: true, width: 100},
    {field: 'UserOrderLocalID', name: '用户本地报单号', isShow: true, isSort: true, width: 100},
    {field: 'OrderPriceType', name: '报单类型', isShow: true, isSort: true, width: 100},
    {field: 'Direction', name: '买卖方向', isShow: true, isSort: true, width: 100},
    {field: 'OffsetFlag', name: '开平标志', isShow: true, isSort: true, width: 100},
    {field: 'HedgeFlag', name: '投机套保标志', isShow: true, isSort: true, width: 100},
    {field: 'TradePrice', name: '成交价格', isShow: true, isSort: true, width: 100},
    {field: 'TradeVolume', name: '成交数量', isShow: true, isSort: true, width: 100},
    {field: 'TradeTime', name: '成交时间', isShow: true, isSort: true, width: 100}

];

//持仓表头
FieldAndData.titles.positionTitles = [
    {field: 'PortfolioID', name: '组合代码', isShow: true, isSort: true, width: 100},
    {field: 'HedgeFlag', name: '投机套保标志', isShow: true, isSort: true, width: 100},
    {field: 'InstrumentID', name: '合约代码', isShow: true, isSort: true, width: 100},
    {field: 'Direction', name: '买卖方向', isShow: true, isSort: true, width: 100},
    {field: 'UserID', name: '交易员', isShow: true, isSort: true, width: 100},
    {field: 'ExchClientID', name: '股东代码', isShow: true, isSort: true, width: 100},
    {field: 'ProductID', name: '产品代码', isShow: true, isSort: true, width: 100},
    {field: 'HisPosition', name: '昨持仓', isShow: true, isSort: true, width: 100},
    {field: 'Position', name: '持仓', isShow: true, isSort: true, width: 100},
    {field: 'FrozenPosition', name: '冻结持仓', isShow: true, isSort: true, width: 100},
    {field: 'Margin', name: '应收保证金', isShow: true, isSort: true, width: 100},
    {field: 'RealMargin', name: '实收保证金', isShow: true, isSort: true, width: 100},
    {field: 'PositionCost', name: '持仓成本', isShow: true, isSort: true, width: 100},
    {field: 'Premium', name: '权利金', isShow: true, isSort: true, width: 100},
    {field: 'TodayOpen', name: '今开持仓', isShow: true, isSort: true, width: 100},
    {field: 'TodayProfit', name: '当日盈亏', isShow: true, isSort: true, width: 100},
    {field: 'TotalProfit', name: '累计盈亏', isShow: true, isSort: true, width: 100},
    {field: 'AccountID', name: '资金账号', isShow: true, isSort: true, width: 100},
    {field: 'ClientID', name: '客户账号', isShow: true, isSort: true, width: 100},
    {field: 'Currency', name: '币种', isShow: true, isSort: true, width: 100}

];

//资金表头
FieldAndData.titles.accountInfoTitles = [
    {field: 'PortfolioID', name: '组合代码', isShow: true, isSort: true, width: 100},
    {field: 'UserID', name: '交易员', isShow: true, isSort: true, width: 100},
    {field: 'LimitMoney', name: '资金额度', isShow: true, isSort: true, width: 100},
    {field: 'PreLimitMoney', name: '前资金额度', isShow: true, isSort: true, width: 100},
    {field: 'Margin', name: '保证金', isShow: true, isSort: true, width: 100},
    {field: 'CanUseMoney', name: '可用资金', isShow: true, isSort: true, width: 100},
    {field: 'FrozenMoney', name: '冻结资金', isShow: true, isSort: true, width: 100},
    {field: 'Fee', name: '手续费', isShow: true, isSort: true, width: 100},
    {field: 'FrozenPremium', name: '冻结权利金', isShow: true, isSort: true, width: 100},
    {field: 'FrozenFee', name: '冻结手续费', isShow: true, isSort: true, width: 100},
    {field: 'TodayProfit', name: '当日盈亏', isShow: true, isSort: true, width: 100},
    {field: 'TotalProfit', name: '累计盈亏', isShow: true, isSort: true, width: 100},
    {field: 'AccountID', name: '资金账号', isShow: true, isSort: true, width: 100},
    {field: 'ClientID', name: '客户账号', isShow: true, isSort: true, width: 100},
    {field: 'Currency', name: '币种', isShow: true, isSort: true, width: 100}
];

//指令表头
FieldAndData.titles.instructionTitles = [
    {field: 'InstructionID', name: '指令编号', isShow: true, isSort: true, width: 100},
    {field: 'TradingDay', name: '交易日', isShow: true, isSort: true, width: 100},
    {field: 'InstructionType', name: '指令类型', isShow: true, isSort: true, width: 100},
    {field: 'InstructionStatus', name: '指令状态', isShow: true, isSort: true, width: 100},
    {field: 'PriceType', name: '价格类型', isShow: true, isSort: true, width: 100},
    {field: 'PortfolioID', name: '投资组合', isShow: true, isSort: true, width: 100},
    {field: 'UserID', name: '交易员', isShow: true, isSort: true, width: 100},
    {field: 'InstrumentID', name: '合约代码', isShow: true, isSort: true, width: 100},
    {field: 'OffsetFlag', name: '开平标志', isShow: true, isSort: true, width: 100},
    {field: 'Direction', name: '买卖方向', isShow: true, isSort: true, width: 100},
    {field: 'HedgeFlag', name: '投机套保标志', isShow: true, isSort: true, width: 100},
    {field: 'LimitPrice', name: '价格', isShow: true, isSort: true, width: 100},
    {field: 'Volatility', name: '波动率', isShow: true, isSort: true, width: 100},
    {field: 'TotalVolume', name: '下单总数', isShow: true, isSort: true, width: 100},
    {field: 'OneOrderVolume', name: '每笔下单数量', isShow: true, isSort: true, width: 100},
    {field: 'CurrentOrderVolume', name: '当前订单数量', isShow: true, isSort: true, width: 100},
    {field: 'TradeVolume', name: '成交数量', isShow: true, isSort: true, width: 100},
    {field: 'OrderType', name: '委托类型', isShow: true, isSort: true, width: 100}
];

//转换函数
FieldAndData.func = {};
//通过指令特殊字段Key，获取对应的value    key:direction,value:0  转换为value:"买"
FieldAndData.func.getInstructSpecialValueByKey = function (key, value) {
    if(FieldAndData.specialField.instructSpecialKey[key]){
        value = FieldAndData.specialField.instructSpecialKey[key][value];
    }
    return value;
};

//通过委托特殊字段Key，获取对应的value    key:status,value:-1  转换为value:"下单失败"
FieldAndData.func.getOrderSpecialValueByKey = function (key, value) {
    if(FieldAndData.specialField.orderSpecialKey[key]){
        // value = FieldAndData.specialField.orderSpecialKey[key][value];
        if(key === "status" && value === "-1"){
            value = "下单失败";
        }else{
            value = FieldAndData.specialField.orderSpecialKey[key][value];
        }
    }

    //判断是否为NaN
    let specialArr = ["TodayProfit", "TotalProfit"];
    if(specialArr.indexOf(key) != -1){
        if(isNaN(value)){
            value = "--";
        }
    }
    return value;
};

//通过持仓特殊字段Key，获取对应的value
FieldAndData.func.getPositionSpecialValueByKey = function (key, value) {
    return FieldAndData.func.getOrderSpecialValueByKey(key, value);
};

//通过成交特殊字段Key，获取对应的value
FieldAndData.func.getTradeSpecialValueByKey = function (key, value) {
    return FieldAndData.func.getOrderSpecialValueByKey(key, value);
};

export default FieldAndData;



