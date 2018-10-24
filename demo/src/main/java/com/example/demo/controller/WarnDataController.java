package com.example.demo.controller;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.WarnData;
import com.example.demo.repository.WarnDataRepository;
import com.example.demo.service.HuobiServiceInit;

@RestController
@RequestMapping(value = "warnData")
public class WarnDataController {
	private Logger log = Logger.getLogger(WarnDataController.class);
    @Autowired
    private WarnDataRepository warnDataRepository;

    @PostMapping(path = "addWarnData")
	public WarnData save(@RequestParam String product,@RequestParam String phoneNumber,@RequestParam String maxPrice,@RequestParam String minPrice) {
    	WarnData warnData = new WarnData();
    	warnData.setMaxPrice(maxPrice);
    	warnData.setMinPrice(minPrice);
    	warnData.setPhoneNumber(phoneNumber);
    	warnData.setProduct(product);
    	
    	WarnData res = warnDataRepository.save(warnData);
    	HuobiServiceInit.client.addSub("market." + res.getProduct() + ".trade.detail", res.getProduct());
    	HuobiServiceInit.WARNDATALIST.add(warnData);
    	return res;
    }
    
    @ResponseBody
    @PostMapping(path = "findAll")
    public List<WarnData> findAll() {
    	return warnDataRepository.findAll();
    }
    
    @PostMapping(path = "delete")
    public void deletePerson(Long id) {
    	WarnData data = warnDataRepository.findById(id).get();
    	for(int i = 0; i < HuobiServiceInit.WARNDATALIST.size(); i++){
    		WarnData temp = HuobiServiceInit.WARNDATALIST.get(i);
    		if(data.getId() == temp.getId()){
    			HuobiServiceInit.WARNDATALIST.remove(i);
    		}
    	}
    	warnDataRepository.deleteById(id);
    	checkUnSub(data);
    }
    
    public void checkUnSub(WarnData data){
    	int index = 0;//删除订阅需要所有该产品全部完成
    	for(WarnData t : HuobiServiceInit.WARNDATALIST){
    		if(t.getProduct().equals(data.getProduct())){
    			index++;
    			break;
    		}
    	}
    	if(index == 0){
    		HuobiServiceInit.client.unSub("market." + data.getProduct() + ".trade.detail", data.getProduct());
    	}
    }
    
    public void defaultDelete(int index){
    	WarnData data = HuobiServiceInit.WARNDATALIST.get(index);
    	HuobiServiceInit.WARNDATALIST.remove(index);
		warnDataRepository.deleteById(data.getId());
		checkUnSub(data);
    }
}