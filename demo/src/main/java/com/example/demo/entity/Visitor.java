package com.example.demo.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import java.io.Serializable;
 
/**
 * Created by Administrator on 2017/7/21.
 */
@Entity
@Table(name = "visitor")
public class Visitor implements Serializable {
    private static final long serialVersionUID = 1L;
 
    @Id
    @Column(name="id",nullable = false)
    @GeneratedValue
    private Long id;
    
    @Column(name = "name", length = 50)
    private String name;
    
    @Column(name = "tel", length = 20)
    private String tel;

    @Column(name = "ip", length = 50)
    private String ip;
    
    @Column(name = "date", length = 10)
    private String date;
    
    @Column(name = "time", length = 10)
    private String time;

    @Column(name = "mac", length = 50)
    private String mac;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}
	
}
