/**
 * changeOrderPage
 * Created by Chx on 16/9/8.
 * 自定义下拉选择框页面
 */

'use strict';

import React, {Component} from 'react';
import CustomSelectorStyle from './CustomSelector.less';
import Immutable from 'immutable';
import arrowDown from '../../img/arrow_down.png';

class CustomSelector extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            contents:props.contents,
            defaultValue:props.defaultValue,
            selecting:false,                         //是否显示下拉框
            selectedString:"全部",                   //当前显示的下拉选项
            width:props.width,
            height:props.height,
            itemMaxCount:props.itemMaxCount,
            selectDir:props.selectDir,
            maxHeight:0,
            top:props.top,
            readOnly:props.readOnly,
            element:props.element,
            offset:0
        };
    }

    componentWillMount() {
        let contents = this.state.contents;         //下拉框显示的数据
        let itemHeight = this.state.height;        //每一条显示的高度
        let itemMaxCount = this.state.itemMaxCount; //下拉框显示的最大数量
        let maxHeight = 0;                          //下拉框显示的最大高度

        if(contents.length > itemMaxCount){ //数据数量大于设定的数量
            maxHeight = itemHeight * itemMaxCount;
        }else{
            maxHeight = itemHeight * contents.length;
        }
        this.setState({
            maxHeight:maxHeight
        });

        if (contents && contents.length > 0){
            let type = this._initType(contents);    //判断下拉数据的类型
            if(type === "0"){
                this.setState({
                    selectedString:this.props.defaultValue ? this.props.defaultValue : contents[0],
                    defaultValue:this.props.defaultValue
                })
            }else{
                let selectedString = this._creatDefaultValue(contents,this.props.defaultValue);
                this.setState({
                    selectedString:selectedString,
                    defaultValue:this.props.defaultValue
                })

            }
        }else{
            if(this.props.defaultValue){    //如果传入defaultValue属性
                this.setState({
                    selectedString:this.props.defaultValue,
                    defaultValue:this.props.defaultValue
                })
            }

        }

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        //传入下拉框的数据不变就不渲染,所以基本上不走下面的代码
        this.setState({
            readOnly:nextProps.readOnly,
            defaultValue:nextProps.defaultValue,
            element:nextProps.element
        })

        //如果改变了默认值
        let type = this._initType(nextProps.contents);
        if(this.props.defaultValue !=nextProps.defaultValue){
            if(type === "0"){
                this.setState({
                    selectedString:nextProps.defaultValue ? nextProps.defaultValue : nextProps.contents[0],
                })
            }else{
                let selectedString = this._creatDefaultValue(nextProps.contents,nextProps.defaultValue);
                this.setState({
                    selectedString:selectedString,
                })
            }
        }
        if(!Immutable.is(Immutable.fromJS(nextProps.contents),Immutable.fromJS(this.state.contents))){

            let itemMaxCount = nextProps.itemMaxCount ? nextProps.itemMaxCount : 10;    //下拉框显示的最大数量
            let itemHeight = nextProps.height ? nextProps.height : 25;          //每一条显示的高度
            let maxHeight = 0;
            if(nextProps.contents.length > itemMaxCount){
                maxHeight = itemHeight * itemMaxCount;
            }else{
                maxHeight = itemHeight * nextProps.contents.length;
            }

            if(nextProps.contents && nextProps.contents.length > 0){
                let type = this._initType(nextProps.contents);  //初始化数据类型 "0"为：["1","2","3"]   "1"为：[{key:"all", value:"全部"},{key:"one", value:"第一个"}]
                if(type === "0"){
                    this.setState({
                        contents:nextProps.contents,
                        selectedString:nextProps.defaultValue ? nextProps.defaultValue : nextProps.contents[0],
                        selectDir:nextProps.selectDir ? nextProps.selectDir : "auto",
                        width:nextProps.width ? nextProps.width : 180,
                        height:nextProps.height ? nextProps.height : 25,
                        maxHeight:maxHeight,
                    });
                }else{
                    let selectedString = this._creatDefaultValue(nextProps.contents,nextProps.defaultValue);
                    this.setState({
                        contents:nextProps.contents,
                        selectedString:selectedString,
                        selectDir:nextProps.selectDir ? nextProps.selectDir : "auto",
                        width:nextProps.width ? nextProps.width : 180,
                        height:nextProps.height ? nextProps.height : 25,
                        maxHeight:maxHeight,
                    });
                }

            }else{
                this.setState({
                    contents:[],
                    selectDir:nextProps.selectDir ? nextProps.selectDir : "auto",
                    width:nextProps.width ? nextProps.width : 180,
                    height:nextProps.height ? nextProps.height : 25,
                    maxHeight:maxHeight
                })

                //if(nextProps.defaultValue){    //如果传入defaultValue属性
                //    this.setState({
                //        selectedString:nextProps.defaultValue
                //    })
                //}else{
                //    this.setState({
                //        selectedString:"全部"
                //    })
                //}
            }
        }
    }


    shouldComponentUpdate(nextProps, nextState){
        if(!Immutable.is(Immutable.fromJS(this.state.contents), Immutable.fromJS(nextState.contents))){
            return true;
        }
        if(this.state.selectedString != nextState.selectedString){
            return true
        }
        if(this.state.top != nextState.top){
            return true
        }
        if(this.state.selecting != nextState.selecting){
            return true
        }
        if(this.state.defaultValue != nextState.defaultValue){
            return true
        }

        return false;
    }


    //筛选默认数据
    _creatDefaultValue(contents,defaultValue){
        let selectedString = contents[0][this.props.showProps];
        if(defaultValue){
            let tempData = contents.filter((item)=>{return(item.key === defaultValue)})[0];
            if(tempData){
                selectedString = tempData[this.props.showProps];
            }
        }
        return selectedString;
    }


    //初始化数据类型
    _initType(contents){
        return typeof contents[0] ==="object" ? "1":"0";
    }
    _onChangeSelectring(value){
        this.setState({
            selectedString:value
        })
    }
    /**
     * 行点击事件
     * @param
     * @private
     */
    _onRowClick(value, position, e){
        this.props.onRowClick(value, position, e);
        this.setState({
            selectedString:value,
            selecting:!this.state.selecting
        });
    }
    /**
     * 行点击事件
     * @param
     * @private
     */
    _onRowClick2(content, position, e){
        this.props.onRowClick(content, position, e);
        this.setState({
            selectedString:content[this.props.showProps],
            selecting:!this.state.selecting
        })
    }


    /**
     * 渲染列表
     * @private
     */
    _renderItems(){
        let contents = this.state.contents;
        let items = [];
        let type = this._initType(contents);    //判断传入的contents的类型
        if(type === "0"){
            for (let i = 0; i < contents.length; i++){
                items.push(<div key={i} onClick={(e)=>this._onRowClick(contents[i], i, e)} className={CustomSelectorStyle.CustomSelectorSelectItem} style={{fontSize: this.props.fontSize + "px", width:this.state.width, minHeight:this.state.height, height:this.state.height, paddingLeft:"6px"}}><label>{contents[i]}</label></div>);
            }
        }else{
            for (let i = 0; i < contents.length; i++){
                items.push(<div key={i} onClick={(e)=>this._onRowClick2(contents[i], i, e)} className={CustomSelectorStyle.CustomSelectorSelectItem} style={{fontSize: this.props.fontSize + "px", width:this.state.width, minHeight:this.state.height, height:this.state.height, paddingLeft:"6px"}}><label>{contents[i][this.props.showProps]}</label></div>);
            }
        }
        return items;
    }

    //点击整个显示区域      (如果分的话还有点击文本区域_clickText、点击按钮区域_clickSelectBtn)
    _clickValueArea(e){
        e.stopPropagation();
        if(this.state.contents.length === 0){
            return true;
        }
        let offsetTop;  //当前div距离浏览器上边框的距离
        if(e.target.id === "valueArea"){
            offsetTop = e.target.offsetTop;
        }else{
            offsetTop = this._getRealOffsetTop(e.target, "valueArea"); //如果不是点击在valueArea这个Div上，例如点击了内层img,则要往上查找valueArea
        }
        this._calcPosition(offsetTop, e);

    }

    /**
     * 递归获取最外层Div距浏览器的高度
     * @param events    e.target
     * @returns {*}
     * @private
     */
    _getRealOffsetTop(events, id){
        if(events.parentNode.id == id){
            return events.parentNode.offsetTop;
        }else{
            return this._getRealOffsetTop(events.parentNode, id);
        }
    }

    //计算下拉框的位置
    _calcPosition(offsetTop, e){
        let height = Number(this.state.height);
        let maxHeight = this.state.maxHeight;
        let selectTotalTop = offsetTop + maxHeight + height;  //offsetTop距离顶端的高度、maxHeight最大显示高度、height本身高度
        let clientHeight = e.target.offsetParent.clientHeight;
        if(this.state.element)
            clientHeight = clientHeight + this.state.element.scrollTop;  //浏览器的高度
        let top = offsetTop - maxHeight;
        // if(this.state.element.scrollTop != 0 && this.state.element){
        //     top -= this.state.element.scrollTop;
        // }
        let selectDir = this.state.selectDir;
        if(clientHeight > selectTotalTop){    //浏览器大于下拉框总高度
            if(selectDir == "up"){
                this.setState({
                    top:top,
                    selecting:!this.state.selecting,
                })
            }else{
                this.setState({
                    top:null,
                    selecting:!this.state.selecting,
                    offset:offsetTop + 25,
                })
            }

        }else{
            if(selectDir == "up" || selectDir == "auto"){
                this.setState({
                    top:top,
                    selecting:!this.state.selecting
                })
            }else{
                this.setState({
                    top:null,
                    selecting:!this.state.selecting,
                    offset:offsetTop + 25,
                })
            }
        }



    }

    _inputValueChanged(e){
        this.setState({
            selectedString: e.target.value,
        })
    }



    render(){


        let top = this.state.top;
        let heightScoll = this.state.element?this.state.element.scrollTop:0;
        let style;
        if(top != null){
            style = {maxHeight:this.state.maxHeight, top: top - heightScoll}
        }else{
            style = {maxHeight:this.state.maxHeight, top: this.state.offset - heightScoll}
        }

        return(
            <div className={CustomSelectorStyle.CustomSelectorRootView} style={{width:this.state.width+"px", height:this.state.height+"px" }} tabIndex ={123} onBlur={this.state.readOnly?()=>this.setState({selecting:false}):()=>{}}>
                <div id="valueArea" className={CustomSelectorStyle.CustomSelectorValueArea} onClick={this._clickValueArea.bind(this)} style={{width:this.state.width +"px", height:this.state.height + "px" }}>
                    <div className={CustomSelectorStyle.CustomSelectorText} style={{width:(this.state.width - 22) + "px", height:this.state.height + "px"}}>
                        {this.state.readOnly?<label style ={{display:"flex", flex:1, marginRight:"6px", marginLeft:"6px",whiteSpace:"nowrap",textOverflow:"ellipsis", fontSize:this.props.fontSize + "px"}}>{this.state.selectedString}</label>:
                        <input className={CustomSelectorStyle.CustomSelectorInput}
                               style = {{fontSize:this.props.fontSize,width:(this.state.width - 34), height:this.state.height,whiteSpace:"nowrap",textOverflow:"ellipsis"}}
                               value = {this.state.selectedString}
                               onChange = {this._inputValueChanged.bind(this)}
                               readOnly={this.state.readOnly}
                        />}
                    </div>
                    <div className={CustomSelectorStyle.CustomSelectorSelectBtn}>
                        <img src={arrowDown}/>
                    </div>
                </div>
                {this.state.selecting?<div className={CustomSelectorStyle.CustomSelectorSelectArea} style={style}>
                    {this._renderItems()}
                </div>:null}
            </div>
        );
    }
}

CustomSelector.defaultProps = {
    onRowClick:()=>{},
    inputValueChanged:()=>{},
    contents:[],  //传入的数据类型 ["1","2","3"]  or [{key:"真实值", value:"显示值"},{key:"one", value:"第一个"}]
    // defaultValue:"第一次进来显示我",            //第一次默认显示值,要传入defaultValue才起效，不传默认第一个值
    width:180,    //下拉框的宽度
    height:20,    //下拉框的高度
    itemMaxCount:10,    //下拉子选项显示的最大数量
    selectDir:"auto",   //下拉框选项方向, "up"向上, "down"向下, "auto"自动(有空间向下，没有空间向上)
    fontSize: 12 ,//字体大小
    readOnly:true,
    defaultValue:null,
    showProps:"value",  // 根据showProps的值来显示数据  [{key:"真实值", value:"显示值", value2:"显示值2"},{key:"one", value:"第一个",value2:"显示值2"}]
};


export default CustomSelector;







