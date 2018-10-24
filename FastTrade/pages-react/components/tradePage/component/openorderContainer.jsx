import React, {Component} from 'react';
import style from './openorderContainer.less';
import Immutable from 'immutable';
import Constant from '../../../constant';
import TradeService from '../../../service/TradeService'

class OpenorderContainer extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state={
            openorderList: this.props.openorderList,
            accountNo: this.props.accountNo,
            exchangeSelect: this.props.exchangeSelect,
        }
    }

    componentDidMount(){
    }

        //组件接受新属性
        componentWillReceiveProps(props) {
            this.setState({
                openorderList: props.openorderList,
                accountNo: props.accountNo,
                exchangeSelect: props.exchangeSelect,
            })
        }

    shouldComponentUpdate(nextProps, nextState){
        // 写这段代码的时候，只有上帝和我知道它是干嘛的
        // 现在只有上帝知道
        if (!Immutable.is(nextState.openorderList, this.state.openorderList)) {
            return true;
        }
        return false;
    }

    _renderTitle(){
        let items = [];
        let titles = ['订单号','交易对','下单价格','下单时间','订单类型','订单状态','操作'];
        for(let temp of titles){
            items.push(<div>{temp}</div>)
        }
        return items;
    }

    /**
     * 撤单
     * @param {*} obj 
     */
    _submitcancel(id){
        let obj = {};
        obj.accountNo = this.state.accountNo;
        obj.exchangeNo = this.state.exchangeSelect;
        obj.orderId = id;
        TradeService.submitcancel(obj).then(
            (res)=>{
                console.log(res)
            }
        ).catch((err)=>{
            console.log(err)
        });

    }

    _renderContainer(){
        let items = [];
        for(let t of this.state.openorderList){
            let item = <div className={style.openorderLine}>
                <div className={style.openorderItem}>{t.id}</div>
                <div className={style.openorderItem}>{t.symbol}</div>
                <div className={style.openorderItem}>{this._checkNum(t.price)}</div>
                <div className={style.openorderItem}>{t.createdat}</div>
                <div className={style.openorderItem}>{t.type}</div>
                <div className={style.openorderItem}>{Constant.openState(t.state)}</div>
                <div className={style.openorderItem}>
                    <input type="button" className={style.cancelBtn} onClick={this._submitcancel.bind(this,t.id)} value="撤单"/>
                </div>
            </div>
            items.push(item);
        }
        return items;
    }

    _checkNum(num){
        return parseFloat(num+'');
    }

    render() {
        return (
            <div className={style.openorderContainer}>
                <div className={style.openorderTitle}>
                    {this._renderTitle()}
                </div>
                {this._renderContainer()}
            </div>
        );
    }
}

OpenorderContainer.defaultProps = {
};

module.exports = OpenorderContainer;




