package com.example.demo.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Account;
import com.example.demo.entity.AccountResponse;
import com.example.demo.entity.Exchange;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.ExchangeRepository;
import com.huobi.api.ApiClient;
import com.huobi.api.JsonUtil;
import com.huobi.response.Accounts;
import com.huobi.response.AccountsResponse;
import com.huobi.response.Balance;
import com.huobi.response.BalanceResponse;

@RestController
@RequestMapping(value = "accountManage")
public class AccountManageController {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ExchangeRepository exchangeRepository;
    
    @ResponseBody
    @PostMapping(path = "findAccount")
    public Map<String, AccountResponse> findAccount(@RequestParam String exchangeNo,@RequestParam String accountName) throws IOException {
    	Account account = accountRepository.findAccount(exchangeNo, accountName);
    	if(account == null){
    		return null;
    	}
    	
        Map<String,AccountResponse> map = new HashMap<>();
        AccountResponse response = new AccountResponse();
        response.setToken(account.getToken());
        response.setSettlementQuantity(account.getSettlementQuantity().toString());
        response.setSettlementToday("0");
        map.put(response.getToken(),response);
    	
    	ApiClient client = new ApiClient(account.getApiKey(), account.getSecretKey(), account.getPrivateKey());
        
        AccountsResponse accounts = client.accounts();
        if(accounts.errMsg != null){
        	response.setErrorMsg(accounts.errMsg);
        	map.put(response.getToken(),response);
        	return map;
        }
        
        JsonUtil.writeValue(accounts);
        //------------------------------------------------------ balance -------------------------------------------------------
        List<Accounts> accountList = (List<Accounts>) accounts.getData();
        BalanceResponse balance = client.balance(String.valueOf(accountList.get(0).getId()));
//        BalanceResponse balance2 = client.balance(String.valueOf(list.get(1).getId()));

        Balance s = (Balance) balance.getData();
        List<LinkedHashMap<String , String>> list = (List) s.getList();
        
        for(LinkedHashMap<String , String> l : list){
        	if(!l.get("balance").equals("0")){
        		if(map.get(l.get("currency")) == null){
        			AccountResponse r = new AccountResponse();
        			r.setToken(l.get("currency"));
        			r.setSettlementToday(l.get("balance"));
        			map.put(l.get("currency"), r);
        		}else{
        			AccountResponse r = map.get(l.get("currency"));
        			r.setSettlementToday(new BigDecimal(l.get("balance")).add(new BigDecimal(r.getSettlementToday())).toString());
        			map.put(l.get("currency"), r);
        		}
        	}
        }
    	return map;
    }
    
    @ResponseBody
    @PostMapping(path = "findAllExchange")
    public List<Exchange> findAllExchange() {
    	return exchangeRepository.findAll();
    }
    
    /**
     * 根据交易所代码，用户代码查询资金账号
     * @param exchangeNo
     * @return
     */
    @ResponseBody
    @PostMapping(path = "findAccountByExchange")
    public List<Account> findAccountByExchange(String exchangeNo,@RequestParam String userNo){
    	return accountRepository.findAccountsByExchangeAndUser(exchangeNo,userNo);
    }
}