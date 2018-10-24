package com.example.demo.ws;

import com.alibaba.fastjson.JSONObject;

public interface IWebSocketService {
	
	public void onReceive(JSONObject json);
	
	public void onReset();
}
