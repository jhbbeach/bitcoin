'use strict';
import React, {Component} from 'react';

import frameworkConfig from "../../config";
import SystemService from '../../service/SystemService';
import LoginService from "../../service/LoginService";
import TitleBar from '../publicComponents/TitleBar.jsx';

import LoginStyle from './Login.less';
import publicStyle from '../../less/pubLess.less'
const electron = window.require('electron');
const {ipcRenderer} = electron;

import WSClient from '../../service/WSClient';
import ShowErrorFunc from '../../utility/ShowErrorFunc'

class Login extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state={
            windowId: -1,
            remember:false,
            loading:false,
            javaStatus:"red",
            tradeStatus:"red",
        }
        this.timer = null;
        this.javaTimer = null;
        this.tradeTimer = null;
        this.startJavaTrade = null;
        this.errorNum = 0;
    }

    componentDidMount() {
        // this.refs.loginButton.disabled = "disabled";
        ShowErrorFunc.dismissError();

        var localStorage = window.localStorage;
        var logonInfo = JSON.parse(localStorage.getItem("logonInfo"));
        if(logonInfo == null){
            this.refs.userid.value = "";
            this.refs.checkbox.checked = false;
        }else{
            if(logonInfo.isRemember){      //记住，充填信息
                let domain = frameworkConfig.domain;
                if(logonInfo[domain]){
                    this.refs.userid.value = logonInfo[domain];
                }else{
                    this.refs.userid.value = logonInfo.userId;
                }
            }else{                          //没记住，不充填
                this.refs.userid.value = "";
            }
            this.refs.checkbox.checked = logonInfo.isRemember;
        }
    }

    /**
     * 查询资金账户
     * @private
     */
    _queryInvestor(){
        LoginService.queryInvestor().then(
            (result)=>{
                if (result && result.length > 0){
                    var localStorage = window.localStorage;
                    localStorage.setItem("investor", JSON.stringify(result));
                    this._queryOrderParams(result);
                    this.setState({
                        loading:false
                    });
                    let winWidth = SystemService.getScreenSize().width;
                    ipcRenderer.send("menuPage",{width:winWidth});
                } else {
                    this.setState({
                        loading:false
                    });
                    ShowErrorFunc.showError('登录失败, 找不到对应的资金账号');
                }
            }
        ).catch(
            (error)=>{
                this.setState({
                    loading:false
                });
                ShowErrorFunc.showError('登录失败, 资金账号查询失败');
            }
        );
    }

    /**
     * 登录
     * @private
     */
    _login(e){
        e.stopPropagation();
        let winWidth = SystemService.getScreenSize().width;
        // ipcRenderer.send("menuPage",{width:winWidth});
        let userId = this.refs.userid.value;
        let password = this.refs.password.value;
        // this.setState({
        //     loading:true,
        // });
        let isRemember = this.refs.checkbox.checked;
        let obj = {};
        obj.userNo = userId;
        obj.password = password;
        LoginService.userLogon(obj)
            .then(result =>{
                if(result){
                    var localStorage = window.localStorage;
                    let obj = JSON.parse(localStorage.getItem("logonInfo")) ? JSON.parse(localStorage.getItem("logonInfo")) :{};
                    obj.userId = userId;
                    obj.isRemember = isRemember;
                    localStorage.setItem("logonInfo",JSON.stringify(obj));
                    ipcRenderer.send("tradePage",{width:winWidth});
                }else{
                    ShowErrorFunc.showError("登录失败, 账户名或密码错误！！");
                }
            }).catch(error =>{
                ShowErrorFunc.showError("登录失败, " + error.errorMsg);
        //         this.setState({
        //             loading:false,
        //         })
        //         this.timer = null;
            }
        )
    }

    componentWillMount() {
        let datas = SystemService.splitWindowUrl();
        this.setState({
            windowId: Number(datas[0]),
            isGetStatus:datas[3]
        })
    }

    /**
     * 键盘事件
     * @private
     */
    _onKeyDown(e){
        if (e.keyCode == 13){
            //回车键
            this._login(e);
        }
    }

    /**
     *  输入框监听
     */
    _inputChange(e){
        if (this.refs.userid.value !== '' && this.refs.password.value !== ''){
            this.refs.loginButton.disabled = '';
        } else {
            this.refs.loginButton.disabled = 'disabled';
        }
    }

    _onTitleBarInputBlur(value){
        console.log("title bar input value is:" + value);
    }

    render() {
        return (
            <div tabIndex="0" className={LoginStyle.login} onKeyDown={this._onKeyDown.bind(this)}>
                <div className={LoginStyle.loginRoot}>
                    <TitleBar windowId = {this.state.windowId} defaultTitle="登录" onBlur={this._onTitleBarInputBlur.bind(this)}/>
                    <div className={LoginStyle.loginTitleDiv}>
                        {/*<img className="loginTitleImg" src={infinite}/>*/}
                        <label className={LoginStyle.loginTitleLabel}>快速交易</label>
                    </div>

                    <div ref="userIdDiv" className={LoginStyle.loginItemDiv}>
                        <span className={LoginStyle.loginSpan}>账号</span>
                        <input onChange={this._inputChange.bind(this, 1)}
                               className={LoginStyle.loginInput}
                               ref="userid" />
                    </div>
                    <div ref="passwordDiv" className={LoginStyle.loginItemDiv}>
                        <span className={LoginStyle.loginSpan}>密码</span>
                        <input onChange={this._inputChange.bind(this, 2)} className={LoginStyle.loginInput} ref="password" type="password"/>
                    </div>
                    <div className={LoginStyle.loginRememberInfoDiv}>
                        <input className={LoginStyle.loginCheckBox} type="checkbox" ref="checkbox" id="checkbox"/>
                        <span className={LoginStyle.loginSpan}>记住账号</span>
                    </div>
                    <button ref="loginButton" className={LoginStyle.loginButton} onClick={this._login.bind(this)}>登   录</button>
                    <div id="showErrorDiv" className={publicStyle.pubShowErrorDiv}>网络连接异常</div>
                </div>
            </div>
        );
    }

}

export default Login;

