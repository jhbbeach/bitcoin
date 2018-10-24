package com.example.demo.tools;

import java.io.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Utils {
	
	public static String md5(String text) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(text.getBytes());
			byte[] digest = md.digest();
			return toHexString(digest);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}

	public static String md5(InputStream in) {
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] buf = new byte[1024 * 2];
			int i = 0;
			while ((i = in.read(buf)) != -1) {
				if (i == 0) {
					continue;
				}
				md.update(buf, 0, i);
			}
			byte[] digest = md.digest();
			return toHexString(digest);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	public static String md5(File file) {
		FileInputStream in = null;
		try {
			in = new FileInputStream(file);
			return md5(in);
		} catch (FileNotFoundException e) {
			throw new RuntimeException(e);
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					// Do-Nothing
				}
			}
		}
	}
	
	public static String getMD5(String str) {
		String reStr = null;
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(str.getBytes());
			byte ss[] = md.digest();
			reStr = bytes2String(ss);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		return reStr;
	}

	public static String sha(String text) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA");
			md.update(text.getBytes());
			byte[] digest = md.digest();
			return toHexString(digest);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
	}

	public static String toHexString(byte[] bytes) {
		StringBuilder buf = new StringBuilder(50);
		int t;
		for (int i = 0; i < bytes.length; i++) {
			t = bytes[i];
			if (t < 0) {
				t += 256;
			}
			if (t < 16) {
				buf.append("0");
			}
			buf.append(Integer.toHexString(t));
		}
		return buf.toString();
	}


	public static String getMessageDigest(String strSrc, String...charset) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		MessageDigest md = null;
		String strDes = null;
		final String ALGO_MD5 = "MD5";

		String realChar = "utf-8";
		if(charset != null && charset.length > 0) {
			realChar = charset[0];
		}
		byte[] bt = strSrc.getBytes(realChar);
		md = MessageDigest.getInstance(ALGO_MD5);
		md.update(bt);
		strDes = toHexString(md.digest());
		return strDes;
	}
	
	private static String bytes2String(byte[] bytes) {
		String hash = "";
		for (int i = 0; i < bytes.length; i++) {
			int temp;
			if (bytes[i] < 0)
				temp = 256 + bytes[i];
			else
				temp = bytes[i];
			if (temp < 16)
				hash += "0";
			hash += Integer.toString(temp, 16);
		}
		hash = hash.toUpperCase();
		return hash;
	}
}
