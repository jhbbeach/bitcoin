package com.example.demo.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.example.demo.entity.WarnData;
import com.example.demo.repository.WarnDataRepository;
import com.example.demo.ws.IWebSocketService;

@Component
@Order(value=1)
public class HuobiServiceInit implements ApplicationRunner{
    @Autowired
    private WarnDataRepository warnDataRepository;
	
	public static final String url = "wss://api.huobi.br.com/ws";
	public static List<WarnData> WARNDATALIST = new ArrayList<>();
	
//	@Autowired
//	public static IWebSocketService service;
//	@Autowired
//	public static WebSoketClient client;
	public static IWebSocketService service = new WebSocketService();
	public static WebSoketClient client = new WebSoketClient(url, service);
	@Override
	public void run(ApplicationArguments args) throws Exception {
//		service = new WebSocketService();
//		client = new WebSoketClient(url, service);
		client.start();
		
		WARNDATALIST = warnDataRepository.findAll();
		for(WarnData w : WARNDATALIST){//订阅行情
			client.addSub("market." + w.getProduct() + ".trade.detail", w.getProduct());
		}
	}
}
