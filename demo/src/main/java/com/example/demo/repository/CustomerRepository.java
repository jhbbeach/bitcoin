package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
//	Optional<WarnData> findById(Long id);
//    
//    @Query("from User u where u.name=:name")
//    User findUser(@Param("name") String name);
}