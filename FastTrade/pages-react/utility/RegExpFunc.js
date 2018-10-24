'use strict';

var RegExpFunc = {};

/**
 *包含至少一个       +
 *包含零个或多个     *
 *包含零个或一个     ?
 *含 X 个 n           {X}  例如，/a{2}/ 不匹配 "candy," 中的 "a"，但是匹配 "caandy," 中的两个 "a"，且匹配 "caaandy." 中的前两个 "a"。
 *{X,}
 *
 */


/**
 * 匹配价格,
 * @param data          要匹配的数据
 * @param firstCount        小数点前面的位数    120.12、 356.1  firstCount = "3"     可以不传,默认小数点前4位
 * @param secondCount       小数点后面的位数    0.12、  5612.65 secondCount = "2"    可以不传,默认小数点后4位
 * @returns {boolean}
 */
RegExpFunc.matchPrice = function(data, firstCount, secondCount){
    firstCount = Number(firstCount) -1 || "3";
    secondCount = secondCount || "4";
    var str = "^[1-9][0-9]{0," + firstCount +"}$";
    var str2 = "^[1-9][0-9]{0," + firstCount + "}\\.\\d{0," + secondCount + "}$";
    var reg = new RegExp(str);
    var reg2 = new RegExp(str2);
    var reg3 = new RegExp("^[0]\\.\\d{0," + secondCount + "}$");
    var reg4 = new RegExp("^[0]$");
    if(reg.test(data) || reg2.test(data) || reg3.test(data) || reg4.test(data)){
        return true;
    }else{
        return false;
    }
};

/**
 * 匹配整数
 * @param data      要匹配的数据
 * @param count         整数位数        可以不传,默认为"4"
 * @returns {boolean}
 */
RegExpFunc.matchInteger = function(data, count){
    count = Number(count)-1 || "3";
    var str = "^[1-9][0-9]{0," + count + "}$";
    var str2 ="^[-][1-9][0-9]{0," + count + "}$";
    var reg = new RegExp(str);
    var reg2 = new RegExp(str2);
    var reg3 = new RegExp("^[-]$");
    var reg4 = new RegExp("^[0]$");
    if(reg.test(data) || reg2.test(data) || reg3.test(data) || reg4.test(data)){
        return true;
    }else{
        return false;
    }
};

/**
 * 匹配正整数
 * @param data      要匹配的数据
 * @param count         正整数位数       可以不传,默认为"4"
 * @returns {boolean}
 */
RegExpFunc.matchPositive = function(data, count){
    count = Number(count)-1 || "3";
    var str = "^[1-9][0-9]{0," + count + "}$";
    var reg = new RegExp(str);
    var reg4 = new RegExp("^[0]$");
    if(reg.test(data)|| reg4.test(data)){
        return true;
    }else{
        return false;
    }
};

//匹配"."
RegExpFunc.matchSpot = function(data, count){
    var reg4 = new RegExp("^[.][0-9]*$");
    if(reg4.test(data)){
        return true;
    }else{
        return false;
    }
};

//minus
//匹配浮点型     包含至少一个  +     包含零个或多个 *   包含零个或一个 ?
RegExpFunc.matchDouble = function(data, count){
    var reg2 = new RegExp("^[-][0-9]$");
    var reg4 = new RegExp("^[-]?[1-9]+[.]?[0-9]*$");        //匹配
    var reg6 = new RegExp("^[-]?[1-9]+[0-9]*[.]?[0-9]*$");        //匹配
    var reg1 = new RegExp("^[-]?[0-9][.][0-9]*$");          //匹配整数只有一位 -0.00X  or  0.00X
    var reg3 = new RegExp("^[-]$");                         //匹配'-'
    var reg5 = new RegExp("^[-][0-9]$");                         //匹配  -
    if(reg1.test(data) || reg2.test(data) || reg3.test(data) || reg4.test(data) || reg5.test(data) || reg6.test(data)){
        return true;
    }else{
        return false;
    }
};

/**
 * 匹配浮点型
 * @param data
 * @param count
 * @returns {boolean}
 */
RegExpFunc.matchFloat = function(data, count){
    var reg2 = new RegExp("^[-][0-9]$");
    var reg4 = new RegExp("^[-]?[0-9]+[.][0-9]*$");
    var reg3 = new RegExp("^[-]$");                         //匹配'-'
    if(reg3.test(data) || reg4.test(data) || reg2.test(data)){
        return true;
    }else{
        return false;
    }
};

export default RegExpFunc;



