package com.example.demo.entity;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
 
/**
 * Created by Administrator on 2017/7/21.
 */
@Entity
@Table(name = "user")
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
 
    @Id
    @Column(name="id",nullable = false)
    @GeneratedValue
    private Long id;
    
    //用户编号
    @Column(name = "userNo", length = 20)
    private String userNo;
    
    //用户名称
    @Column(name = "userName", length = 100)
    private String userName;

    //用户类型：1--管理员；2--交易员；
    @Column(name = "userType", length = 1)
    private String userType;
    
    //登陆密码
    @Column(name = "password", length = 50)
    private String password;
    
    //联系电话
    @Column(name = "mobile", length = 20)
    private String mobile;

    //最后登录时间
    @Column(name = "lastLogon", length = 14)
    private String lastLogon;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserNo() {
		return userNo;
	}

	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getLastLogon() {
		return lastLogon;
	}

	public void setLastLogon(String lastLogon) {
		this.lastLogon = lastLogon;
	}
    
    
}
