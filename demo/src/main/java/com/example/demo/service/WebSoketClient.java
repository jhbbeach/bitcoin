package com.example.demo.service;

import com.example.demo.ws.IWebSocketService;
import com.example.demo.ws.Topic;
import com.example.demo.ws.WebSocketBase;

//import tx.huobi.ws.IWebSocketService;
//import tx.huobi.ws.Topic;
//import tx.huobi.ws.WebSocketBase;

public class WebSoketClient extends WebSocketBase{
	public WebSoketClient(String url,IWebSocketService service){
		super(url,service);
	}
	
	public void topicAll(String symbol){
		for (int i = 0; i < Topic.PERIOD.length; i++) {
			this.addSub(String.format(Topic.KLINE_SUB, symbol,Topic.PERIOD[i]), "client1");
		}

		this.addSub(String.format(Topic.DEPTH_SUB, symbol), "client1");
		this.addSub(String.format(Topic.TRADE_SUB, symbol), "client1");
		
	}
}
