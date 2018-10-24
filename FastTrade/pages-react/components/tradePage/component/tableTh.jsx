import React, {Component} from 'react';
import style from './table.less'
import Immutable from 'immutable';
const electron = window.require('electron');
const {ipcRenderer} = electron;
// const ipc = require('electron').ipcMain;
class tableTh extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state={
            temp:  this.props.data,
            // temp:  Immutable.fromJS({bid1:[0],bid2:[0],ask1:[0],ask2:[0]}),
            product: this.props.product,
        }
        this.selectProduct = null;
        this.color = [];
    }

    componentDidMount(){
    }

    //组件接受新属性
    componentWillReceiveProps(props) {
        this.setState({
            temp: props.data,
            product: props.product,
        })
    }
    

    shouldComponentUpdate(nextProps, nextState){
        // 写这段代码的时候，只有上帝和我知道它是干嘛的
        // 现在只有上帝知道
        if (!Immutable.is(Immutable.fromJS(nextState.temp), Immutable.fromJS(this.state.temp))) {
            this.color = [];
            this.color.push(this._getColor(nextState.temp.bid1[0] - this.state.temp.bid1[0]));
            this.color.push(this._getColor(nextState.temp.bid2[0] - this.state.temp.bid2[0]));
            this.color.push(this._getColor(nextState.temp.ask1[0] - this.state.temp.ask1[0]));
            this.color.push(this._getColor(nextState.temp.ask2[0] - this.state.temp.ask2[0]));
            this.color.push(this._getColor(nextState.temp.price - this.state.temp.price));
            return true;
        }
        if (!Immutable.is(nextState.product, this.state.product)) {
            return true;
        }
        return false;
    }

    _getColor(value){
        if(value > 0){
            return style.red;
        }else if(value < 0){
            return style.green;
        }else{
            return style.nomal;
        }
    }

    _itemClick(type,obj,product){
        this.props.itemClick(type,obj,product);
    }

    _lineClick(product){
        // this.selectProduct = product;
    }

    render() {
        let temp = this.state.temp;
        return (
            // + ' ' + (this.selectProduct == this.state.product ? style.lineSelect : '')
            <div className={style.tableDatasItems} onClick={this._lineClick.bind(this,this.state.product)}>
                <div onClick={this._itemClick.bind(this,null,temp,this.state.product)}>{this.state.product}</div>
                <div onClick={this._itemClick.bind(this,'bid1',temp,this.state.product)} className={this.color[0]}>{parseFloat(temp.bid1[0]+'')}</div>
                <div onClick={this._itemClick.bind(this,'bid2',temp,this.state.product)} className={this.color[1]}>{parseFloat(temp.bid2[0]+'')}</div>
                <div onClick={this._itemClick.bind(this,'price',temp,this.state.product)} className={this.color[4]}>{parseFloat(temp.price+'')}</div>
                <div onClick={this._itemClick.bind(this,'ask1',temp,this.state.product)} className={this.color[2]}>{parseFloat(temp.ask1[0]+'')}</div>
                <div onClick={this._itemClick.bind(this,'ask2',temp,this.state.product)} className={this.color[3]}>{parseFloat(temp.ask2[0]+'')}</div>
            </div>
        );
    }
}

module.exports = tableTh;




