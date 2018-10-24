
var frameworkConfig = {
	domain: 'http:// :8080',
	project: 'quantdo',
	timeout: 1800000,
	errorHandlers: {
		// 自定义错误处理文件路径, 从app根目录开始
		notLogonHandler: function(){window.location.href="login/login.html";},
		// permissionDeniedHandler: 'service/errorHandlers/permissionDeniedHandler.js',
		// versionNotSupportHandler: 'service/errorHandlers/versionNotSupportHandler.js',
		// sessionInvalidHandler: 'service/errorHandlers/sessionInvalidHandler.js',
		// noServiceHandler: 'service/errorHandlers/noServiceHandler.js',
		// noInterfaceHandler: 'service/errorHandlers/noInterfaceHandler.js',
		// jsonConvertErrorHandler: 'service/errorHandlers/jsonConvertErrorHandler.js',
		// parameterCountErrorHandler: 'service/errorHandlers/parameterCountErrorHandler.js',
		// parameterTypeErrorHandler: 'service/errorHandlers/parameterTypeErrorHandler.js',
		// jsonToJavaErrorHandler: 'service/errorHandlers/jsonToJavaErrorHandler.js',
		// businessProcessErrorHandler: 'service/errorHandlers/businessProcessErrorHandler.js',
		// entityWithoutIdHandler: 'service/errorHandlers/entityWithoutIdHandler.js',
		// dbConnectErrorHandler: 'service/errorHandlers/dbConnectErrorHandler.js',
		fieldValidateErrorHandler: function(msg){layer.msg('字段校验异常：' + msg,{icon: 2})},
		timeoutHandler: function(){layer.msg('自定义错误处理：超时',{icon: 2});},
		unhandledErrorHandler: function(msg){layer.msg('自定义未处理错误处理：' + msg,{icon: 2});}
	}
};
;(function(root) {
	   //domain为空时默认取当前host
	   if(!frameworkConfig.domain || frameworkConfig.domain=="") {
		   frameworkConfig.domain = window.location.protocol+"//"+ window.location.host;     
	   }
	   if(frameworkConfig.domain=="file://"){
		   frameworkConfig.domain = "http://127.0.0.1:8080";
	   }           
	   if(!frameworkConfig.wsdomain || frameworkConfig.wsdomain=="") {
		   frameworkConfig.wsdomain = "ws://"+ window.location.host;        
	   }  
	   if(frameworkConfig.wsdomain=="ws://"){
		   frameworkConfig.wsdomain = "ws://127.0.0.1:8080";
	   }           
	})(window);
