'use strict';

import React, {Component} from 'react';

import style from './TitleBar.less'

import SystemService from '../../service/SystemService';
const electron = window.require('electron');
const {ipcRenderer} = electron;

class TitleBar extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            windowId: props.windowId,
            title: this.props.title,
            width: 190,
        }
        this.windowInfos;// = props.windowInfos.toJS()
    }

    componentDidMount() {
        let value = this.state.title;
        let num = value.replace(/[\u0391-\uFFE5]/g,"aa").length;
        this.setState({
            width: num * 8,
        });
        //let systemType = SystemService.getSystemType();
        //if (systemType !== SystemService.constant.LINUX && systemType !== SystemService.constant.MAC && systemType !== SystemService.constant.UNIX){
        //    this.refs.input.value = this.props.defaultTitle;
        //}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            windowId: nextProps.windowId,
        })
        if(nextProps.windowInfos){
            this.windowInfos = nextProps.windowInfos.toJS()
        }
    }

    /**
     * 关闭按钮点击事件
     * @private
     */
    _onCloseClick() {
        if (Number(this.state.windowId) != -1) {
            ipcRenderer.send("windowControl", 3, Number(this.state.windowId))
        }
        this.props.onCloseClick();
    }

    /**
     * 最小化按钮点击事件
     * @private
     */
    _onMinClick() {
        if (Number(this.state.windowId) != -1) {
            ipcRenderer.send("windowControl", 1, Number(this.state.windowId))
        }
    }

    /**
     * 最大化按钮点击事件
     * @private
     */
    _onMaxClick() {
        if (Number(this.state.windowId) != -1) {
            if(this.props.name == "MarketMakerMonitorPage"){
                ipcRenderer.send("windowControl", 2, Number(this.state.windowId),true)
            }else{
                ipcRenderer.send("windowControl", 2, Number(this.state.windowId));
            }
        }
    }

    /**
     * 渲染div
     * @private
     */
    _renderDiv() {
        let systemType = SystemService.getSystemType();
        let items = [];
        if (systemType !== SystemService.constant.LINUX && systemType !== SystemService.constant.MAC && systemType !== SystemService.constant.UNIX) {
            items.push(<div className={style.titleBarTitleArea} >
                <div className={style.noDrag} onContextMenu={this._rightBtn.bind(this, "1122")}>
                    <input ref="input"
                           style={{width:this.state.width,minWidth:65}}
                           value={this.state.title}
                           className={style.titleBarTitleInput}
                           onFocus={this._InputStart.bind(this)}
                           onBlur={this._InputCompleted.bind(this)}
                           onChange={this._titleInputChanged.bind(this)}/>
                </div>
            </div>);
            if (this.props.minimizable) {
                items.push(<div className={style.titleBarMinImg} onClick={this._onMinClick.bind(this)}></div>);
            }

            if (this.props.maximizable) {
                items.push(<div className={style.titleBarWinMaxImg} onClick={this._onMaxClick.bind(this)}></div>);
            }

            items.push(<div className={style.titleBarCloseWinImg} onClick={this._onCloseClick.bind(this)}></div>);
        } else {
            items.push(<div className={style.titleBarCloseMacImg} onClick={this._onCloseClick.bind(this)}></div>);
            if (this.props.minimizable) {
                items.push(<div className={style.titleBarMinImg} onClick={this._onMinClick.bind(this)}></div>);
            }
            if (this.props.maximizable) {
                items.push(<div className={style.titleBarMacMaxImg} onClick={this._onMaxClick.bind(this)}></div>);
            }
            items.push(<div className={style.titleBarTitleArea}>
                <div className={style.noDrag} onContextMenu={this._rightBtn.bind(this, "1122")}>
                    <input ref="input"
                           value={this.state.title}
                           className={style.titleBarTitleInput}
                           onFocus={this._InputStart.bind(this)}
                           onBlur={this._InputCompleted.bind(this)}
                           onContextMenu={this._rightBtn.bind(this, "1122")}
                           onChange={this._titleInputChanged.bind(this)}/>
                </div>
            </div>);

        }
        return items;
    }

    _InputStart() {
        this.title = this.state.title;
    }

    _InputCompleted() {
        let sameTitleWindowInfos = this.windowInfos.filter((item) => {
            return item.title === this.state.title
        });
        if (sameTitleWindowInfos && sameTitleWindowInfos.length > 0) {
            let same = sameTitleWindowInfos.filter((item) => {
                return (item.windowId !== this.state.windowId)
            });
            if (same && same.length > 0) {
                this.setState({
                    title: this.title,
                })
                alert("窗口命名重复");
            } else {
                this.props.titleChangedCallBack(this.state.title);
            }
        } else {
            this.props.titleChangedCallBack(this.state.title)
        }
    }

    _titleInputChanged(event) {
        let value = event.target.value;
        let num = value.replace(/[\u0391-\uFFE5]/g,"aa").length;
        this.setState({
            title: value,
            width: num * 8 > 150 ? 150 : num * 8,
        })
    }

    _rightBtn(title, e, f, g) {
        this.refs.smallMenu.focus();
        let x = e.nativeEvent.pageX;
        let y = e.nativeEvent.pageY;
        let num = this.props.contextMenuArray.length;
        this.setState({
            ContextMenuDynamicStyle: {width: 150, height: num * 20, top: y, left: x},
            localKey: title,
        })

    }

    render() {
        return (
            <div className={style.titleBarRootDiv}>
                <div className={style.titleBarDragDiv}></div>
                <div className={style.titleBarItemDiv}>
                    {this._renderDiv()}
                </div>
                <div ref="smallMenu" tabIndex={1234516} className={style.ContextMenuContainer}
                     style={this.state.ContextMenuDynamicStyle}
                     onBlur={() => {
                         this.setState({ContextMenuDynamicStyle: {width: 0, height: 0, top: 0, left: 0}, localKey: ""})
                     }}>
                </div>
            </div>
        );
    }

}

TitleBar.defaultProps = {
    windowId: -1,
    minimizable: true,
    maximizable: false,
    defaultTitle: '',
    onBlur: () => {
    },
    renderView: () => {
    },
    contextMenuArray: [],
    title: "",//标题栏
    onCloseClick: () => {
    },
    titleChangedCallBack: () => {
    },
    contextMenuCallback: () => {
    },
};

export default TitleBar;