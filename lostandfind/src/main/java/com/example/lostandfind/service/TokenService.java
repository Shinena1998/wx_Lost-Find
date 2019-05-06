package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequestWrapper;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class TokenService {

    @Autowired
    private  StringRedisTemplate template;

    public JSONObject makeToken(String openid){
        Random rand  = new Random();
        String str = "qwertyuiopasdfghjklzxcvbnm1234567890";
        StringBuffer value = new StringBuffer();
        for(int i = 0 ;i < 10 ; i ++){
            value.append(str.charAt(rand.nextInt(36)));
        }
        if(template.hasKey(openid)){
            template.delete(openid);
        }
        template.opsForValue().set(openid,value.toString(),7200, TimeUnit.SECONDS);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("token",value);
        jsonObject.put("openid",openid);
        return jsonObject;
    }
}
