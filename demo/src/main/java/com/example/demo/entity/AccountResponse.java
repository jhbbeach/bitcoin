package com.example.demo.entity;

public class AccountResponse {
	private String token;
	private String settlementQuantity;
	private String settlementToday;
	private String errorMsg;
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getSettlementQuantity() {
		return settlementQuantity;
	}
	public void setSettlementQuantity(String settlementQuantity) {
		this.settlementQuantity = settlementQuantity;
	}
	public String getSettlementToday() {
		return settlementToday;
	}
	public void setSettlementToday(String settlementToday) {
		this.settlementToday = settlementToday;
	}
	public String getErrorMsg() {
		return errorMsg;
	}
	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	
}
