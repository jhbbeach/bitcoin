package com.example.demo.entity;

public enum OrderType {
	BUYMARKET("buy-market"),
	BUYLIMIT("buy-limit"),
	SELLMARKET("sell-market"),
	SELLLIMIT("sell-limit");
	
	private OrderType(String value){
		this.value = value;
	}
	
	private String value;
	public String getValue() {
		return value;
	}	
}
