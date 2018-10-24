'use strict';

import $ from 'jquery';

var ShowErrorFunc = {
    dismissError(){
        $("#showErrorDiv").hide();
    },

    showError(errorMessage){
        $("#showErrorDiv").show();
        $("#showErrorDiv").html(errorMessage);
        setTimeout(function(){
            $("#showErrorDiv").hide();
        }, 5000);
    },
    showErrorTwoSecond(errorMessage){
        $("#showErrorDiv").show();
        $("#showErrorDiv").html(errorMessage);
        setTimeout(function(){
            $("#showErrorDiv").hide();
        }, 2000);
    }
};

export default ShowErrorFunc;