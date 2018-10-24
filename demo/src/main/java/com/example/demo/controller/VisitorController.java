package com.example.demo.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Visitor;
import com.example.demo.repository.VisitorRepository;

@RestController
@RequestMapping(value = "visitor")
public class VisitorController {

    @Autowired
    private VisitorRepository visitorRepository;
    
    @ResponseBody
    @PostMapping(path = "addVisitor")
    public void addUser(String name,String tel,String ip) throws IOException {
    	Visitor visitor = new Visitor();
    	visitor.setIp(ip);
    	visitor.setName(name);
    	visitor.setTel(tel);
    	
    	Date dt=new Date();
    	SimpleDateFormat date = new SimpleDateFormat("yyyy:MM:dd");
    	SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss");
    	visitor.setDate(date.format(dt));
    	visitor.setTime(time.format(dt));
    	visitorRepository.save(visitor);
    }
}