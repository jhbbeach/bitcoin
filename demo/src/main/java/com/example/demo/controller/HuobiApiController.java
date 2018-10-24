package com.example.demo.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.example.demo.entity.Account;
import com.example.demo.repository.AccountRepository;
import com.example.demo.tools.SignInstance;
import com.huobi.api.ApiClient;
import com.huobi.api.JsonUtil;
import com.huobi.request.CreateOrderRequest;
import com.huobi.request.OpenOrderRequest;
import com.huobi.response.Balance;
import com.huobi.response.BalanceBean;
import com.huobi.response.BalanceResponse;
import com.huobi.response.OrdersDetail;
import com.huobi.response.SubmitcancelResponse;
import com.huobi.response.Symbol;
import com.huobi.response.Trade;
import com.huobi.response.TradeBean;
import com.huobi.response.TradeResponse;

@RestController
@RequestMapping(value = "huobiApi")
public class HuobiApiController {
    @Autowired
    private AccountRepository accountRepository;
    
    /**
     * 委托订单
     * @param type
     * @param exchangeNo
     * @param accountNo
     * @param product
     * @param price
     * @param amount
     * @return
     * @throws IOException
     */
    @ResponseBody
    @PostMapping(path = "order")
    public String order(@RequestParam String type,@RequestParam String exchangeNo,@RequestParam String accountNo,@RequestParam String product,@RequestParam String price,@RequestParam String amount) throws IOException {
    	Account account = accountRepository.findAccount(exchangeNo,accountNo);
    	ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey());
    	CreateOrderRequest request = new CreateOrderRequest();
    	List<com.huobi.response.Account> acccounts = client.getAccounts();
    	for(com.huobi.response.Account a : acccounts){
    		if(a.type.equals("spot")){
    			request.accountId = String.valueOf(a.id);
    		}
    	}
    	request.symbol = product;
    	request.amount = amount;
    	request.price = price;
    	request.source = "api";
    	request.type = type;
    	Long orderId = client.createOrder(request);
    	return client.placeOrder(orderId);
    }
    
    /**
     * 获取交易对
     * @param exchangeNo
     * @param accountNo
     * @return
     */
    @ResponseBody
    @PostMapping(path = "getSymbols")
    public List<Symbol> getSymbols(@RequestParam String exchangeNo,@RequestParam String accountNo){
    	Account account = accountRepository.findAccount(exchangeNo,accountNo);
    	if(account != null){
    		if(!SignInstance.getInstance().getSymbols().isEmpty()){
    			return SignInstance.getInstance().getSymbols();
    		}else{
    			ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey());
    			List<Symbol> symbols = client.getSymbols();
    			SignInstance.getInstance().setSymbols(symbols);
    			for(Symbol sym : symbols){
    				if(!SignInstance.getInstance().getBaseSymbols().contains(sym.quoteCurrency)){
    					SignInstance.getInstance().getBaseSymbols().add(sym.quoteCurrency);
    				}
    			}
    			return symbols;
    		}
    	}
    	return null;
    }

    /**
     * 查询未成交单
     * @param exchangeNo
     * @param accountNo
     * @return
     */
    @ResponseBody
    @PostMapping(path = "openOrders")
    public List<OrdersDetail> openOrders(@RequestParam String exchangeNo,@RequestParam String accountNo){
    	Account account = accountRepository.findAccount(exchangeNo,accountNo);
    	ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey());
    	OpenOrderRequest orderRequest = new OpenOrderRequest();
        orderRequest.setAccountid("");
        orderRequest.setSize("");
        orderRequest.setSymbol("");
    	return client.openOrders(orderRequest);
    }
    	
    /**
     * 获取账户信息
     * @param exchangeNo
     * @param accountNo
     * @return
     */
    @ResponseBody
    @PostMapping(path = "getAccounts")
    public List<com.huobi.response.Account> getAccounts(@RequestParam String exchangeNo,@RequestParam String accountNo){
    	Account account = accountRepository.findAccount(exchangeNo,accountNo);
    	ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey());
//    	OpenOrderRequest orderRequest = new OpenOrderRequest();
    	return client.getAccounts();
    }

    /**
     * 撤单
     * @param exchangeNo
     * @param accountNo
     * @param orderId
     * @return
     */
    @ResponseBody
    @PostMapping(path = "submitcancel")
    public SubmitcancelResponse submitcancel(@RequestParam String exchangeNo,@RequestParam String accountNo,@RequestParam String orderId){
    	Account account = accountRepository.findAccount(exchangeNo,accountNo);
    	ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey());
    	return client.submitcancel(orderId);
    }

    /**
     * 获取最新成交价
     * @param exchangeNo
     * @param accountNo
     * @param symbol
     * @param volume
     * @return
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
	public BigDecimal trade(@RequestParam String exchangeNo,@RequestParam String accountNo,@RequestParam String symbol,@RequestParam BigDecimal volume,@RequestParam int index){
       	Account account = accountRepository.findAccount(exchangeNo,accountNo);
    	ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey());
    	TradeResponse tradeResponse = client.trade(symbol + SignInstance.getInstance().getBaseSymbols().get(index));
//    	System.out.println("查询的交易对"+symbol + SignInstance.getInstance().getBaseSymbols().get(index));
    	Trade<List<LinkedHashMap>> trade = tradeResponse.getTick();
    	if("error".equals(tradeResponse.getStatus())){
    		if(SignInstance.getInstance().getBaseSymbols().size() > index){
//    			System.out.println("更换标的："+SignInstance.getInstance().getBaseSymbols().get(index+1));
    			return trade(exchangeNo, accountNo, symbol, volume,index+1);
    		}else{
    			return new BigDecimal("0");
    		}
    	}
    	List<LinkedHashMap> list = trade.getData();
    	TradeBean tb = JSON.parseObject(JSON.toJSONString(list.get(0)), TradeBean.class);
    	if(index != 0){
//    		System.out.println("转回原标的！！！");
    		return trade(exchangeNo, accountNo, SignInstance.getInstance().getBaseSymbols().get(index), BigDecimal.valueOf(tb.getPrice()).multiply(volume), 0);
    	}
//    	System.out.println("----------------------------------------------------------------");
    	return BigDecimal.valueOf(tb.getPrice()).multiply(volume);
    }
    
    /**
     * 查询账户余额
     * @param exchangeNo
     * @param accountNo
     * @param accountId
     * @return
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
	@ResponseBody
    @PostMapping(path = "balancePersent")
    public Account balancePersent(@RequestParam String exchangeNo,@RequestParam String accountNo){
       	Account account = accountRepository.findAccount(exchangeNo,accountNo);
    	ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey());
       	List<com.huobi.response.Account> acccounts = client.getAccounts();
       	String accountId = null;
    	for(com.huobi.response.Account a : acccounts){
    		if(a.type.equals("spot")){
    			accountId = String.valueOf(a.id);
    		}
    	}
    	BigDecimal settlementQuantity = account.getSettlementQuantity();//上次结算数量
    	if(!SignInstance.getInstance().getBaseSymbols().get(0).equals(account.getToken())){
    		settlementQuantity = this.trade(exchangeNo, accountNo, account.getToken(),settlementQuantity,0);
    	}
    	if(accountId != null){
    		BalanceResponse<?> res = client.balance(accountId);
    		Balance<List<LinkedHashMap>> balance = (Balance) res.getData();
    		List<LinkedHashMap> list = balance.getList();
    		BigDecimal nowQuantity = new BigDecimal("0");
    		for(LinkedHashMap map : list){
    			if(!map.get("balance").equals("0")){
    				BalanceBean bean = JSON.parseObject(JSON.toJSONString(map), BalanceBean.class);
    				BigDecimal tempvolume = new BigDecimal(bean.getBalance());
    				//所有有持仓的币
    		    	if(!SignInstance.getInstance().getBaseSymbols().get(0).equals(bean.getCurrency())){
    		    		tempvolume = this.trade(exchangeNo, accountNo, bean.getCurrency(), tempvolume,0);
    		    	}
    		    	nowQuantity = nowQuantity.add(tempvolume);
    			}
    		}
    		account.setRiseFall(nowQuantity.subtract(settlementQuantity).divide(settlementQuantity));
    	}
    	return account;
    }
}