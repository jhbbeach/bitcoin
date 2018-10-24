package com.example.demo.tools;

import java.util.ArrayList;
import java.util.List;

import com.huobi.response.Symbol;

public class SignInstance {
	private static SignInstance signInstance = null;
	public static synchronized SignInstance getInstance(){
	      if (signInstance == null) {    
	    	  signInstance = new SignInstance();  
	        }    
		return signInstance;
	}

	private List<Symbol> symbols = new ArrayList<Symbol>();
	private List<String> baseSymbols = new ArrayList<String>();
	public List<Symbol> getSymbols() {
		return symbols;
	}

	public void setSymbols(List<Symbol> symbols) {
		this.symbols = symbols;
	}

	public List<String> getBaseSymbols() {
		return baseSymbols;
	}

	public void setBaseSymbols(List<String> baseSymbols) {
		this.baseSymbols = baseSymbols;
	}
	
}
