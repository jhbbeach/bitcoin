import React, {Component} from 'react';
import style from './accountContainer.less';
import Immutable from 'immutable';

class AccountContainer extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state={
            accountList: this.props.accountList
        }
        this.accountSelect = '';
    }

    componentDidMount(){
        // this._accountSelect(this.state.accountList[0].accountName);
    }

    //组件接受新属性
    componentWillReceiveProps(props) {
        this.setState({
            accountList: props.accountList,
        })
        if(this.accountSelect == ''){
            this._accountSelect(this.state.accountList[0].accountName);
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        // 写这段代码的时候，只有上帝和我知道它是干嘛的
        // 现在只有上帝知道
        // if (!Immutable.is(nextState.accountList, this.state.accountList)) {
        //     return true;
        // }
        
        return true;
    }

    _accountSelect(accountName){
        this.props._accountSelect(accountName);
        if(this.accountSelect != ''){
            this.refs[this.accountSelect].className = this.refs[this.accountSelect].className.split(' ')[0];
        }
        this.accountSelect = accountName;
        this.refs[accountName].className +=  " " + style.accountLineSelect;
    }

    _renderTitle(){
        let items = [];
        let titles = ['账户名称','托管币种','数量','托管日期','涨跌幅'];
        for(let temp of titles){
            items.push(<div>{temp}</div>)
        }
        return items;
    }

    _renderContainer(){
        let items = [];
        for(let t of this.state.accountList){
            let color;
            if(t.riseFall > 0){
                color = style.red;
            }else if(t.riseFall < 0){
                color = style.green;
            }else{
                color = style.normal
            }
            let item = <div ref={t.accountName} className={style.accountLine} onClick={this._accountSelect.bind(this,t.accountName)}>
                <div className={style.accountItem}>{t.accountName}</div>
                {/* <div className={style.accountItem}>{t.accountNo}</div> */}
                <div className={style.accountItem}>{t.token}</div>
                <div className={style.accountItem}>{t.quantity}</div>
                <div className={style.accountItem}>{t.trusteeDate}</div>
                <div className={style.accountItem+" "+color}>{(t.riseFall ? t.riseFall : 0).toFixed(2) +"%"}</div>
            </div>
            items.push(item);
        }
        return items;
    }

    render() {
        return (
            <div className={style.accountContainer}>
                <div className={style.accountTitle}>
                    {this._renderTitle()}
                </div>
                {this._renderContainer()}
            </div>
        );
    }
}

AccountContainer.defaultProps = {
};

module.exports = AccountContainer;




