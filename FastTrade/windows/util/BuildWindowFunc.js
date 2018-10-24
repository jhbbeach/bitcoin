'use strict';
function createUrl(contentName, windowId, extendsParams){
    let extendsParamsStr = '';
    if (extendsParams){
        for (let key in extendsParams){
            extendsParamsStr = extendsParamsStr + "&" + key + "=" + extendsParams[key];
        }
    }
    return ('file://' + __dirname + '/../../dispersePages/' + contentName + '.html' + '?windowId=' + windowId + extendsParamsStr);
};

module.exports = {
    createUrl
};