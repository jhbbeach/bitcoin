package com.example.demo.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "customer")
public class Customer {
    private static final long serialVersionUID = 1L;
    
    @Id
    @Column(name="id",nullable = false)
    @GeneratedValue
    private Long id;
 
    //客户编号
    @Column
    private String customerNo;
    
    //客户名称
    @Column
    private String customerName;
    
    //客户性质：1--机构；2--个人。
    @Column
    private String type;
    
    //联系人
    @Column
    private String linkman;
    
    //联系地址
    @Column
    private String addr;
    
    //邮编
    @Column
    private String zip;
    
    //E-mail
    @Column
    private String email;
    
    //联系电话
    @Column
    private String mobile;
    
    //微信
    @Column
    private String weichat;
    
    //QQ
    @Column
    private String qq;
    
    //传真
    @Column
    private String fax;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCustomerNo() {
		return customerNo;
	}

	public void setCustomerNo(String customerNo) {
		this.customerNo = customerNo;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getLinkman() {
		return linkman;
	}

	public void setLinkman(String linkman) {
		this.linkman = linkman;
	}

	public String getAddr() {
		return addr;
	}

	public void setAddr(String addr) {
		this.addr = addr;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getWeichat() {
		return weichat;
	}

	public void setWeichat(String weichat) {
		this.weichat = weichat;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}
    
    
}
