package com.example.demo.tools;

import java.util.List;

public class MarketDatas {
	private List<List<String>> asks;
	private List<List<String>> bids;
	private String version;
	private String ts;
	public List<List<String>> getAsks() {
		return asks;
	}
	public void setAsks(List<List<String>> asks) {
		this.asks = asks;
	}
	public List<List<String>> getBids() {
		return bids;
	}
	public void setBids(List<List<String>> bids) {
		this.bids = bids;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getTs() {
		return ts;
	}
	public void setTs(String ts) {
		this.ts = ts;
	}
	
}
