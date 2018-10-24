package com.example.demo.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.tools.MD5Utils;

@RestController
@RequestMapping(value = "user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
	
    @ResponseBody
    @PostMapping(path = "login")
    public User login(String userNo,String password) throws IOException {
    	String pwd = MD5Utils.getMD5(password).toLowerCase();
    	User user = userRepository.checkUser(userNo, pwd);
    	return user;
    }
}