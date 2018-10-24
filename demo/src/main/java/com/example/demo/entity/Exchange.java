package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "exchange")
public class Exchange {
    private static final long serialVersionUID = 1L;
    
    @Id
    @Column(name="id",nullable = false)
    @GeneratedValue
    private Long id;
 
    //交易所编号
    @Column(name = "exchangeNo", nullable = false, length = 20)
    private String exchangeNo;
    
    //交易所名称
    @Column(name = "exchangeName", nullable = false, length = 100)
    private String exchangeName;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getExchangeNo() {
		return exchangeNo;
	}

	public void setExchangeNo(String exchangeNo) {
		this.exchangeNo = exchangeNo;
	}

	public String getExchangeName() {
		return exchangeName;
	}

	public void setExchangeName(String exchangeName) {
		this.exchangeName = exchangeName;
	}
    
    
}
