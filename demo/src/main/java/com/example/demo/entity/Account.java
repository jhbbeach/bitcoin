package com.example.demo.entity;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Digits;

@Entity
@Table(name = "account")
public class Account {
    private static final long serialVersionUID = 1L;
    
    @Id
    @Column(name="id",nullable = false)
    @GeneratedValue
    private Long id;
 
    //账户编号
    @Column(name = "accountNo", nullable = false, length = 20)
    private String accountNo;
 
    //客户编号
    @Column(name = "customerNo", nullable = false, length = 20)
    private String customerNo;
 
    //交易所编号
    @Column(name = "exchangeNo", nullable = false, length = 20)
    private String exchangeNo;

    //账户名称
    @Column(name = "accountName", nullable = false, length = 100)
    private String accountName;

    //账户密码
    @Column(name = "password", nullable = false, length = 100)
    private String password;
    
    //apiKey
    @Column(name = "apiKey", nullable = false, length = 200)
    private String apiKey;
    
    //secretKey
    @Column(name = "secretKey", nullable = false, length = 200)
    private String secretKey;
    
    //privateKey
    @Column(name = "privateKey", nullable = false, length = 200)
    private String privateKey;
    
    //托管币种
    @Column(name = "token", nullable = false, length = 20)
    private String token;
    
    //数量
    @Column(name = "quantity", precision = 18, scale = 8)
	@Digits(integer = 10, fraction = 8)
    private BigDecimal quantity;
    
    //托管日期
    @Column(name = "trusteeDate", nullable = false, length = 8)
    private String trusteeDate;
    
    //托管费类型：1--免费；2--固定费用；3--比例（月）；4--比例（季度）；5--比例（年）。
    @Column(name = "feeType", nullable = false, length = 1)
    private String feeType;
    
    //托管费用/比例
    @Column(name = "trusteeFee", precision = 18, scale = 8)
	@Digits(integer = 10, fraction = 8)
    private BigDecimal trusteeFee;
    
    //托管费是否返还：0--否；1--是。
    @Column(name = "isReturn", nullable = true, length = 1)
    private String isReturn;
    
    //结算周期：1--月；2--季度；3--年
    @Column(name = "settlementInterval", nullable = false, length = 1)
    private String settlementInterval;
    
    //最后结算日期
    @Column(name = "lastSettlementDate", nullable = false, length = 8)
    private String lastSettlementDate;
    
    //结算后数量
    @Column(name = "settlementQuantity", precision = 18, scale = 8)
	@Digits(integer = 10, fraction = 8)
    private BigDecimal settlementQuantity;

    //所属交易员
    @Column(name = "userNo", nullable = false, length = 20)
    private String userNo;
    
    //涨跌幅
    @Transient
    private BigDecimal riseFall;
    
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public String getCustomerNo() {
		return customerNo;
	}

	public void setCustomerNo(String customerNo) {
		this.customerNo = customerNo;
	}

	public String getExchangeNo() {
		return exchangeNo;
	}

	public void setExchangeNo(String exchangeNo) {
		this.exchangeNo = exchangeNo;
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = apiKey;
	}

	public String getSecretKey() {
		return secretKey;
	}

	public void setSecretKey(String secretKey) {
		this.secretKey = secretKey;
	}

	public String getPrivateKey() {
		return privateKey;
	}

	public void setPrivateKey(String privateKey) {
		this.privateKey = privateKey;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public BigDecimal getQuantity() {
		return quantity;
	}

	public void setQuantity(BigDecimal quantity) {
		this.quantity = quantity;
	}

	public String getTrusteeDate() {
		return trusteeDate;
	}

	public void setTrusteeDate(String trusteeDate) {
		this.trusteeDate = trusteeDate;
	}

	public String getFeeType() {
		return feeType;
	}

	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}

	public BigDecimal getTrusteeFee() {
		return trusteeFee;
	}

	public void setTrusteeFee(BigDecimal trusteeFee) {
		this.trusteeFee = trusteeFee;
	}

	public String getIsReturn() {
		return isReturn;
	}

	public void setIsReturn(String isReturn) {
		this.isReturn = isReturn;
	}

	public String getSettlementInterval() {
		return settlementInterval;
	}

	public void setSettlementInterval(String settlementInterval) {
		this.settlementInterval = settlementInterval;
	}

	public String getLastSettlementDate() {
		return lastSettlementDate;
	}

	public void setLastSettlementDate(String lastSettlementDate) {
		this.lastSettlementDate = lastSettlementDate;
	}

	public BigDecimal getSettlementQuantity() {
		return settlementQuantity;
	}

	public void setSettlementQuantity(BigDecimal settlementQuantity) {
		this.settlementQuantity = settlementQuantity;
	}

	public String getUserNo() {
		return userNo;
	}

	public void setUserNo(String userNo) {
		this.userNo = userNo;
	}

	public BigDecimal getRiseFall() {
		return riseFall;
	}

	public void setRiseFall(BigDecimal riseFall) {
		this.riseFall = riseFall;
	}

    
}
