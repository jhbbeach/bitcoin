package com.example.demo.service;

import java.math.BigDecimal;
import java.util.concurrent.locks.ReentrantLock;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.aliyuncs.exceptions.ClientException;
import com.example.demo.VmsDemo;
import com.example.demo.controller.WarnDataController;
import com.example.demo.entity.WarnData;
import com.example.demo.tools.SpringUtil;
import com.example.demo.tools.TradeDetail;
import com.example.demo.ws.IWebSocketService;

@Service
@Component
public class WebSocketService implements IWebSocketService {
	private final ReentrantLock lock = new ReentrantLock(); 
	private Logger log = Logger.getLogger(WebSocketService.class);
	
	@Override
	public void onReceive(JSONObject json) {
		if (json.toString().contains("tick")) {
			TradeDetail data = (TradeDetail) JSON.parseObject(json.toJSONString(), TradeDetail.class);
			try {
				checkCall(data);
			} catch (ClientException e) {
				log.error("error"+e);
				e.printStackTrace();
			}
		}else{
			log.info(json.toString());
			System.out.println(json.toString());
		}

	}
         
	public void onReset() {
	}

	public void checkCall(TradeDetail data) throws ClientException{
		WarnDataController controller =  SpringUtil.getBean(WarnDataController.class);
		String key = data.getCh().substring(7, data.getCh().indexOf(".trade.detail"));
		for(int i = 0; i < HuobiServiceInit.WARNDATALIST.size(); i++){
			WarnData dpdata = HuobiServiceInit.WARNDATALIST.get(i);
			if(key.equals(dpdata.getProduct()) && dpdata.getPhoneNumber() != null && !"".equals(dpdata.getPhoneNumber())){
				if(!"".equals(dpdata.getMaxPrice()) && dpdata.getMaxPrice() != null && new BigDecimal(data.getTick().getData().get(0).getPrice()).compareTo(new BigDecimal(dpdata.getMaxPrice())) >= 0){
					try{
						lock.lock();
						controller.defaultDelete(i);
//					    controller.deletePerson(dpdata.getId());
						this.log.info("触发上限："+dpdata.getProduct()+",设定价格"+dpdata.getMaxPrice()+",当前价格"+data.getTick().getData().get(0).getPrice());
						VmsDemo.singleCallByTts(dpdata.getProduct(), dpdata.getMaxPrice(), dpdata.getPhoneNumber());
					}finally{
						lock.unlock();
					}
				}else if(!"".equals(dpdata.getMinPrice()) && dpdata.getMinPrice() != null && new BigDecimal(data.getTick().getData().get(0).getPrice()).compareTo(new BigDecimal(dpdata.getMinPrice())) <= 0){
					try{
						lock.lock();
//						controller.deletePerson(dpdata.getId());
						controller.defaultDelete(i);
						this.log.info("触发下限："+dpdata.getProduct()+",设定价格"+dpdata.getMinPrice()+",当前价格"+data.getTick().getData().get(0).getPrice());
						VmsDemo.singleCallByTts(dpdata.getProduct(), dpdata.getMinPrice(), dpdata.getPhoneNumber());
					}finally{
						lock.unlock();
					}

				}				
			}
		}
	}
}