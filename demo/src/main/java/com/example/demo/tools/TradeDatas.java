package com.example.demo.tools;

import java.util.List;

public class TradeDatas {
	public class TradeDetailDatas{
		private String amount;
		private String price;
		private String id;
		private String ts;
		private String direction;
		public String getAmount() {
			return amount;
		}
		public void setAmount(String amount) {
			this.amount = amount;
		}
		public String getPrice() {
			return price;
		}
		public void setPrice(String price) {
			this.price = price;
		}
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getTs() {
			return ts;
		}
		public void setTs(String ts) {
			this.ts = ts;
		}
		public String getDirection() {
			return direction;
		}
		public void setDirection(String direction) {
			this.direction = direction;
		}
		
	}
	private List<TradeDetailDatas> data;
	private String id;
	private String ts;
	
	public List<TradeDetailDatas> getData() {
		return data;
	}
	public void setData(List<TradeDetailDatas> data) {
		this.data = data;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTs() {
		return ts;
	}
	public void setTs(String ts) {
		this.ts = ts;
	}
	
}
