package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.WarnData;

@Repository
public interface WarnDataRepository extends JpaRepository<WarnData, Long> {
//	Optional<WarnData> findById(Long id);
//    
//    @Query("from User u where u.name=:name")
//    User findUser(@Param("name") String name);
}