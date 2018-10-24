package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {
//    @Autowired
//    private UserRepository userRepository;
	
//	private UserController user;
	
//	@RequestMapping("/")    ---------》http://localhost:8080
    @RequestMapping("/hello")
    public String index() {
//    	user.addPerson(null);
        return "Hello World";
    }
}
