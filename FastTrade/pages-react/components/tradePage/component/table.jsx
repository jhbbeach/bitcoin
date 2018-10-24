import React, {Component} from 'react';
import style from './table.less';
import TableTh from './tableTh';
import Immutable from 'immutable';

class Table extends Component {
    // 构造
    constructor(props) {
        super(props);
        this.state={
            titles: props.titles,
            datas: props.datas,
        }
        // this.WS_URL = 'wss://api.huobi.pro/ws';
    }

    componentDidMount(){
        // huobi.huobi.init();
        // this.ws = new HuobiWs();
    }

    /**
     * 绘制标题
     */
    _renderTitles(){
        let items = [];
        for(let temp of this.state.titles){
            items.push(<div>{temp}</div>)
        }
        return items;
    }

    /**
     * 绘制表格内容
     */
    _renderContent(){
        let items = [];
        for(let key in this.state.datas){
            let temp = this.state.datas[key];
            items.push(<TableTh  data={Immutable.fromJS(temp).toJS()} product={key} itemClick={this.props._itemClick.bind(this)}></TableTh>)
        }
        return items;
    }

    render() {
        return (
            <div className={style.table+" "+style.marketDataContainer}>
                <div className={style.tableTitles}>
                    {this._renderTitles()}
                </div>
                <div className={style.tableDatas}>
                    {this._renderContent()}
                </div>
            </div>
        );
    }
}

Table.defaultProps = {
    titles:[],//[{titleKey: 'control', keyName: '操作', isShow: true, minWidth: 130, isSpecial:true},{},{}]
    datas:{},
};

module.exports = Table;




