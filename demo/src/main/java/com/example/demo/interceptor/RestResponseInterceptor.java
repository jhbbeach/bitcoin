package com.example.demo.interceptor;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class RestResponseInterceptor implements HandlerInterceptor{

	private int startTime;
	private int endTime;
	//依赖注入,请看配置文件
	public void setStartTime(int startTime) {
		this.startTime = startTime;
	}
 
	public void setEndTime(int endTime) {
		this.endTime = endTime;
	}
	//在控制器执行前调用
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		System.out.println("执行preHandle方法-->01");
		Calendar cal = Calendar.getInstance();
		//获得当前时间对应的小时数,例如：12:05-->12,13:15-->13
		int hour = cal.get(Calendar.HOUR_OF_DAY);
		if (startTime <= hour && hour < endTime) {
			return true;  //通过拦截器，继续执行请求
		} else {//给定的时间之外禁止登录
			request.setAttribute("msg", "非登录时段");
			request.getRequestDispatcher("Login.jsp").forward(request, response);
			return false;  //没有通过拦截器，返回登录页面
		}
	}
	//在后端控制器执行后调用
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		System.out.println("执行postHandle方法-->02");
//		super.postHandle(request, response, handler, modelAndView);
	}
	//整个请求执行完成后调用
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		System.out.println("执行afterCompletion方法-->03");
//		super.afterCompletion(request, response, handler, ex);
	}

}
