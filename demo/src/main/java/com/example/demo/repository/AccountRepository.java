package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    @Query("from Account a where a.exchangeNo=:exchangeNo and a.accountName=:accountName")
    Account findAccount(@Param("exchangeNo") String exchangeNo,@Param("accountName") String accountName);
    
    @Query("from Account a where a.exchangeNo=:exchangeNo and a.userNo=:userNo")
    List<Account> findAccountsByExchangeAndUser(@Param("exchangeNo") String exchangeNo,@Param("userNo") String userNo);
    
}