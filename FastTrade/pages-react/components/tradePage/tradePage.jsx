import React, {Component} from 'react';

// var WebSocket = require('ws');
import style from './tradePage.less'
const electron = window.require('electron');
import add from '../../img/addIns.png';
import check from '../../img/check.png';
import TitleBar from '../publicComponents/TitleBar.jsx'
import CustomSelector from '../publicComponents/CustomSelector.jsx'
import SystemService from '../../service/SystemService'
import TradeService from '../../service/TradeService'
import huobi from '../../service/huobi'
// import Immutable from 'immutable';

import Table from './component/table'
import AccountContainer from './component/accountContainer'
import OpenorderContainer from './component/openorderContainer'
// import HuobiWs from '../../service/HuobiWs'

class TradePage extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.barData = SystemService.splitWindowUrl();
        this.titles = ['交易对','买二价','买一价','最新价','卖一价','卖二价'];
        this.tradeType = 1;//交易类型,默认1:限价交易
        this.inputSelect = 1;//当前选中输入框,默认限价单买入价
        this.sambolSelect = null;//选中的交易对
        this.exchangeSelect = '1001';//默认选择火币
        this.userId = '';
        this.accountSelect = '';//选中的账号
        this.openorderInterval = null;
        this.accountList = [];//账户
        this.openorderList = [];//未成交
        this.sambolsList = [];//交易对
        this.priceSymbol = '';
        this.volumeSymbol = '';
        this.sambolsCheckList = JSON.parse(window.localStorage.getItem("sambolsCheckList")) ? JSON.parse(window.localStorage.getItem("sambolsCheckList"))[this.exchangeSelect] : [];//被选中的交易对
        this.state = {
            updateFlag:false,
            marketDataList:{},
        }
    }

    componentDidMount(){
        this.exchangeRowClick({key:'1001'});
        let obj = JSON.parse(window.localStorage.getItem("logonInfo")) ? JSON.parse(window.localStorage.getItem("logonInfo")) : {};
        // obj.userId = '666';
        this.userId = obj.userId;
        
        let requestObj = {};
        requestObj.exchangeNo = this.exchangeSelect;
        requestObj.userNo = this.userId;
        // requestObj.userNo = obj.userId;
        TradeService.findAccountByExchange(requestObj).then(
            (res)=>{
                if (res){
                    this.accountList = res;
                    requestObj.accountNo = res[0].accountName;
                    for(let t of res){
                        requestObj.accountNo = t.accountName;
                        this._balancePersent(requestObj);
                    }
                    this._getSymbols(requestObj);
                    // this.refs.AccountContainer._accountSelect(res[0].accountName);
                    this.setState({
                        updateFlag: !this.state.updateFlag
                    })
                }
            }
        ).catch((err)=>{
            console.log(err)
        });

        // this.accountSelect = '666';
        // requestObj.accountNo = this.accountSelect;
        // this._getOpenInterval(requestObj);

        // this._getSymbols(requestObj);

        //前端直接发送rest请求
        // TradeService.depth({'symbol':'ethbtc','type':'step0'}).then(
        //     (res)=>{
        //         if (res){
        //             console.log(res)
        //         }
        //     }
        // ).catch((err)=>{
        //     console.log(err)
        //     }
        // );
    }

    _accountSelect(value){
        this.accountSelect = value;
        
        let requestObj = {};
        requestObj.exchangeNo = this.exchangeSelect;
        requestObj.userNo = this.userId;
        requestObj.accountNo = this.accountSelect;
        
        if(this.openorderInterval != null){
            clearInterval(this.openorderInterval);
        }
        this.openorderInterval = this._getOpenInterval(requestObj);
    }

    _getSymbols(requestObj){
        TradeService.getSymbols(requestObj).then(
            (res)=>{
                if (res){
                    this.sambolsList = res;
                    this.setState({
                        updateFlag: !this.state.updateFlag
                    })
                }
            }
        ).catch((err)=>{
            console.log(err)
        });
    }

    _addSambol(){
        if(this.refs.sambolCheckBackground.style.display == ''){
            this.refs.sambolCheckBackground.style.display = 'none';
        }else{
            this.refs.sambolCheckBackground.style.display = '';
        }
    }

    sambolCheckClick(e){
        e.stopPropagation();
    }

    _sambolCheckContainerItem(symbol){
        let tempmarketDataList = this.state.marketDataList;
        // let tempmarketDataList = Immutable.fromJS(this.state.marketDataList).toJS();
        let index = this.sambolsCheckList.indexOf(symbol);
        if(index > -1){
            this._unsubscribe(symbol);
            this.sambolsCheckList.splice(index,1);
            delete tempmarketDataList[symbol]
        }else{
            this.sambolsCheckList.push(symbol);
            this._subscribe(symbol);
        }
        let localsambolsCheckList = JSON.parse(window.localStorage.getItem(",")) ? JSON.parse(window.localStorage.getItem("sambolsCheckList")) : {};
        localsambolsCheckList[this.exchangeSelect] = this.sambolsCheckList;
        window.localStorage.setItem('sambolsCheckList',JSON.stringify(localsambolsCheckList));
        this.setState({
            marketDataList: tempmarketDataList,
            updateFlag: !this.state.updateFlag
        })
    }

    _creatSambols(){
        let items = [];
        for(let t of this.sambolsList){
            let item = <div className={style.sambolCheckContainerItem} onClick={this._sambolCheckContainerItem.bind(this,t.symbol)}>
                <span>{t.symbol}
                </span>
                <img src={this.sambolsCheckList.indexOf(t.symbol) > -1 ? check : ''} alt=""/>
            </div>
            items.push(item);
        }
        return items;
    }

    /**
     * 推送回调
     * @param {*} data 
     */
    onmsgCallback(data){
        // console.log(data)
        if(data.ch && data.ch.indexOf('.depth.step1') > -1){
            let marketDataList = this.state.marketDataList;
            let key = data.ch.substring(7,data.ch.indexOf('.depth.step'));
            if(!marketDataList[key]){
                marketDataList[key] = {};
            }
            marketDataList[key].ask1 = data.tick.asks[0] ? data.tick.asks[0] : [NaN,0];
            marketDataList[key].ask2 = data.tick.asks[1] ? data.tick.asks[1] : [NaN,0];
            marketDataList[key].bid1 = data.tick.bids[0] ? data.tick.bids[0] : [NaN,0];
            marketDataList[key].bid2 = data.tick.bids[1] ? data.tick.bids[1] : [NaN,0];
            this.setState({
                marketDataList:marketDataList
            })
        }else if(data.ch && data.ch.indexOf('.trade.detail') > -1){
            // this._checkTrade(data);
            let marketDataList = this.state.marketDataList;
            let key = data.ch.substring(7,data.ch.indexOf('.trade.detail'));
            if(!marketDataList[key]){
                marketDataList[key] = {};
            }
            marketDataList[key].amount = data.tick.data[0].amount;
            marketDataList[key].direction = data.tick.data[0].direction;
            marketDataList[key].price = data.tick.data[0].price;
            this.setState({
                marketDataList:marketDataList
            })
        }else{
            huobi.ws_onTouch(data)
        }
    }

    _getOpenInterval(requestObj){
        let _this = this;
        TradeService.openOrders(requestObj).then(
            (res)=>{
                if (res){
                    _this.openorderList = res;
                    _this.setState({
                        updateFlag: !_this.state.updateFlag
                    })
                    console.log(res)
                }
            }
        ).catch((err)=>{
            console.log(err)
        });
        return setInterval(function(){
            TradeService.openOrders(requestObj).then(
                (res)=>{
                    if (res){
                        _this.openorderList = res;
                        _this.setState({
                            updateFlag: !_this.state.updateFlag
                        })
                    }
                }
            ).catch((err)=>{
                console.log(err)
            });
        },3000)
    }

    _balancePersent(requestObj){
        let _this = this;
        return setInterval(function(){
            TradeService.balancePersent(requestObj).then(
                (res)=>{
                    if (res){
                        _this._updateaccountList(res);
                    }
                }
            ).catch((err)=>{
                console.log(err)
            });
        },5000)
    }

    _updateaccountList(account){
        for(let acc of this.accountList){
            if(acc.accountName == account.accountName && acc.userNo == account.userNo){
                acc.riseFall = account.riseFall;
            }
        }
        this.setState({
            updateFlag: !this.state.updateFlag
        })
    }

    // _checkTrade(tradeRtnObj){
    //     for(let t of tradeRtnObj.tick.data){
    //         if(t.tradeId){
    //             for(let openOrder of this.openorderList){
    //                 if(t.tradeId == openOrder.id){
    //                     openOrder.amount -= t.amount;
    //                 }
    //             }
    //         }
    //     }

    // }

    /**
     * 交易所选项点击事件
     * @param {key: "1001", value: "火币"} obj 
     */
    exchangeRowClick(obj){
        this.exchangeSelect = obj.key;
        if(obj.key == '1001'){
            huobi.ws_msgReceive = this.onmsgCallback.bind(this);
            huobi.ws_onMsgConnect();

            for(let t of this.sambolsCheckList){
                this._subscribe(t);
            }
        }else{
            huobi.ws_onDisConnect();
        }
    }

    /**
     * 订阅
     * @param {} product 
     */
    _subscribe(product){
        huobi.ws_subscribe("market."+product+".depth.step1");
        huobi.ws_subscribe("market."+product+".trade.detail");
    }

    /**
     * 取消订阅
     * @param {} product 
     */
    _unsubscribe(product){
        huobi.ws_unsubscribe("market."+product+".depth.step1");
        huobi.ws_unsubscribe("market."+product+".trade.detail");
    }

    /**
     * 买卖按钮
     * @param {} key 
     */
    buysellClick(key){
        if(this.sambolSelect == null){
            console.log('请选择交易对')
            return;
        }
        if(this.accountSelect == null){
            console.log('请选择交易账户')
            return;
        }
        let obj = {};
        obj.accountNo = this.accountSelect;
        obj.product = this.sambolSelect;
        obj.exchangeNo =  this.exchangeSelect;
        if(key == 1){//buy
            if(this.tradeType == 1){//限价
                obj.type = 'buy-limit';
                obj.price = this.refs.limitBuyPrice.value;
                obj.amount = this.refs.limitBuyVolume.value;
            }else{//市价
                obj.type = 'buy-market';
                obj.price = 0;
                obj.amount = this.refs.marketBuyPrice.value;
            }
        }else if(key == 2){//sell
            if(this.tradeType == 1){//限价
                obj.type = 'sell-limit';
                obj.price = this.refs.limitSellPrice.value;
                obj.amount = this.refs.limitSellVolume.value;
            }else{//市价
                obj.type = 'sell-market';
                obj.price = 0;
                obj.amount = this.refs.marketSellPrice.value;
            }
        }
        TradeService.order(obj).then(
            (res)=>{
                if (res){
                    console.log(res)
                }
            }
        ).catch((err)=>{
            console.log(err)
            }
        );
    }

    /**
     * 交易模式切换
     * @param {*} type:1:限价,2:市价 
     */
    tradeTypeClick(type){
        this.tradeType = type;
        this.setState({
            updateFlag : !this.state.updateFlag,
        })
    }

    /**
     * 价格单击事件
     * @param {*} type 
     * @param {*} obj 
     * @param {*} product 
     */
    _itemClick(type,obj,product){
        if(type != null){
            let value = obj[type][0];
            if(type == 'price'){
                value = obj[type];
            }
            if(this.inputSelect == 1){//买入价
                this.refs.limitBuyPrice.value = value;
            }else if(this.inputSelect == 2){//卖出价
                this.refs.limitSellPrice.value = value;
            }
        }
        
        this.sambolSelect = product;
        for(let symbol of this.sambolsList){
            if(symbol.symbol == product){
                this.priceSymbol = symbol.quoteCurrency;
                this.volumeSymbol = symbol.baseCurrency;
            }
        }
    }

    /**
     * 价格输入框选中事件
     * @param {*} type 
     */
    _inputFocus(type){
        this.inputSelect = type;
    }

    render() {
        return (
            <div className={style.mainPage}>
                <TitleBar windowId={this.barData[0]}/>
                <div className={style.titleContainer}>
                    <div className={style.exchangeSelect}>
                        交易所：
                        <CustomSelector contents={[{key:"1001", value:"火币"},{key:"1002", value:"币安"}]} onRowClick={this.exchangeRowClick.bind(this)}></CustomSelector>
                        <img className={style.addbtn} src={add} alt="add" onClick={this._addSambol.bind(this)}/>
                    </div>
                    <div className={style.accountLogin}>当前登陆账号：{this.userId}</div>
                </div>
                <div className={style.bodyContainer}>
                    <div className={style.leftContainer}>
                        <AccountContainer ref="AccountContainer" accountList={this.accountList} _accountSelect={this._accountSelect.bind(this)}></AccountContainer>
                        <OpenorderContainer openorderList={this.openorderList} exchangeSelect={this.exchangeSelect} accountNo={this.accountSelect}></OpenorderContainer>
                        {/* <div className={style.positionContainer}>
                            <div className={style.positionTitle}>持仓信息/挂单信息</div>
                        </div> */}
                    </div>
                    <div className={style.rightContainer}>
                        <Table className={style.marketDataContainer} datas={this.state.marketDataList} titles={this.titles} _itemClick={this._itemClick.bind(this)}></Table>
                        <div className={style.tradeContainer}>
                            <div className={style.tradeContainerBuy}>
                                <div className={style.defaultTitle}>
                                    <div className={(this.tradeType == 1 ? style.tradeTypeSelect : '') + ' ' +style.tradeType} onClick={this.tradeTypeClick.bind(this,1)}>限价交易</div>
                                    <div className={(this.tradeType == 2 ? style.tradeTypeSelect : '') + ' ' +style.tradeType} onClick={this.tradeTypeClick.bind(this,2)}>市价交易</div>
                                </div>
                                <div className={(this.tradeType == 2 ? style.hiddeStyle : '') + ' ' + style.inputArea}>
                                    买入价
                                    <div className={style.inputTextDiv}>
                                        <input id='limitBuyPrice' ref="limitBuyPrice" onFocus={this._inputFocus.bind(this,1)} className={style.inputText}/>
                                        <span className={style.inputSymbol}>{this.priceSymbol}</span>
                                    </div>
                                    {/* <input id='limitBuyPrice' ref="limitBuyPrice" onFocus={this._inputFocus.bind(this,1)} className={style.inputTextDiv} type="text"/> */}
                                </div>
                                <div className={(this.tradeType == 2 ? style.hiddeStyle : '') + ' ' + style.inputArea}>
                                    买入量
                                    <div className={style.inputTextDiv}>
                                        <input id='limitBuyVolume' ref="limitBuyVolume"  type="text" className={style.inputText}/>
                                        <span className={style.inputSymbol}>{this.volumeSymbol}</span>
                                    </div>
                                    {/* <input id='limitBuyVolume' ref="limitBuyVolume" className={style.inputTextDiv} type="text"/> */}
                                </div>
                                <div className={(this.tradeType == 1 ? style.hiddeStyle : '') + ' ' + style.inputArea}>   
                                    交易额(以市场上最优价格买入)
                                    <div className={style.inputTextDiv}>
                                        <input id='marketBuyPrice' ref="marketBuyPrice" className={style.inputText} type="text"/>
                                        <span className={style.inputSymbol}>{this.priceSymbol}</span>
                                    </div>
                                </div>
                                <div className={style.inputArea}>
                                    <input className={style.inputBtn} type="button" value='买入' onClick={this.buysellClick.bind(this,1)}/>
                                </div>
                            </div>
                            <div className={style.tradeContainerSell}>
                                <div className={style.defaultTitle}></div>
                                <div className={(this.tradeType == 2 ? style.hiddeStyle : '') + ' ' + style.inputArea}>
                                    卖出价
                                    <div className={style.inputTextDiv}>
                                        <input id='limitSellPrice' ref='limitSellPrice' onFocus={this._inputFocus.bind(this,2)} className={style.inputText}/>
                                        <span className={style.inputSymbol}>{this.priceSymbol}</span>
                                    </div>
                                    {/* <input id='limitSellPrice' ref='limitSellPrice' onFocus={this._inputFocus.bind(this,2)} className={style.inputTextDiv} type="text"/> */}
                                </div>
                                <div className={(this.tradeType == 2 ? style.hiddeStyle : '') + ' ' + style.inputArea}>
                                    卖出量
                                    <div className={style.inputTextDiv}>
                                        <input id='limitSellVolume' ref='limitSellVolume'  type="text" className={style.inputText}/>
                                        <span className={style.inputSymbol}>{this.volumeSymbol}</span>
                                    </div>
                                    {/* <input id='limitSellVolume' ref='limitSellVolume' className={style.inputTextDiv} type="text"/> */}
                                </div>
                                <div className={(this.tradeType == 1 ? style.hiddeStyle : '') + ' ' + style.inputArea}>   
                                    交易额(以市场上最优价格卖出)
                                    <div className={style.inputTextDiv}>
                                        <input id='marketSellPrice' ref='marketSellPrice' className={style.inputText} type="text"/>
                                        <span className={style.inputSymbol}>{this.volumeSymbol}</span>
                                    </div>
                                </div>
                                <div className={style.inputArea}>
                                    <input className={style.inputBtn} type="button" value='卖出' onClick={this.buysellClick.bind(this,2)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.sambolCheckBackground} onClick={this._addSambol.bind(this)}  ref="sambolCheckBackground" style={{display:'none'}}>
                    <div className={style.sambolCheck} onClick={this.sambolCheckClick.bind(this)}>
                        <div className={style.sambolCheckTitle}>交易对选择</div>
                        <div className={style.sambolCheckContainer}>
                            {this._creatSambols()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = TradePage;




