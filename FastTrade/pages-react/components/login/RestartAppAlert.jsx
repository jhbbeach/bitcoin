'use strict'
import React, {Component} from 'react';

const electron = window.require('electron');
const {ipcRenderer} = electron;
import SystemService from '../../service/SystemService';

import RestartAppAlertStyle from './RestartAppAlert.less';
import publicStyle from '../../less/pubLess.less';

class RestartAppAlert extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state= {
            windowId:-1,
        }
    }

    componentWillMount() {
        let datas = SystemService.splitWindowUrl();
        this.setState({
            windowId:datas[0],
        })
    }

    /**
     * 确定按钮点击事件
     * @param e
     * @private
     */
    _onButtonClick(e){
        e.stopPropagation();
        ipcRenderer.send("restartApp", 1);
    }

    render() {
        return (
            <div className={RestartAppAlertStyle.restartAppAlertRootDiv}>
                <label className={RestartAppAlertStyle.restartAppAlertLabel}>登录过期, 是否重新登录?</label>
                <div className={RestartAppAlertStyle.restartAppAlertButtonRootDiv}>
                    <div className={publicStyle.btnW50H24} style={{marginRight: "55px", marginLeft: "15px"}} onClick={(e)=>{ e.stopPropagation(); ipcRenderer.send("restartApp", 2);}}>取消</div>
                    <div className={publicStyle.btnW50H24} style={{marginRight: "15px"}} onClick={this._onButtonClick.bind(this)}>确定</div>
                </div>
            </div>
        );
    }
}

export default RestartAppAlert;