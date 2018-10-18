package com.example.lostandfind.service;

import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequestWrapper;
import java.util.Random;

@Component
public class TokenService {
    private String token;
    private String session;

    public String makeToken(){
        Random rand  = new Random();
        String str = "qwertyuiopasdfghjklzxcvbnm1234567890";
        StringBuffer tokenBuffer = new StringBuffer();
        for(int i = 0 ;i < 10 ; i ++){
            tokenBuffer.append(str.charAt(rand.nextInt(36)));
        }
        return tokenBuffer.toString();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getSession() {
        return session;
    }

    public void setSession(String session) {
        this.session = session;
    }
}
