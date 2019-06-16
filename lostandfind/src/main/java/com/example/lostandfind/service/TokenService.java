package com.example.lostandfind.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequestWrapper;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class TokenService {

    @Autowired
    private  StringRedisTemplate template;
    @Autowired
    private RestTemplate restTemplate;
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
    @Value("${appId.xutLf}")
    private String appId;
    @Value("${appSecret.xutLf}")
    private String secret;
    public JSONObject getUserInfo(String code){
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid="+appId+"&secret="+secret+"&js_code=" + code + "&grant_type=authorization_code";
        JSONObject jsonObject = JSON.parseObject(restTemplate.exchange(url, HttpMethod.GET,null,String.class).getBody());
        jsonObject.put("token",this.makeToken(jsonObject.getString("openid")));
        return jsonObject;
    }
}
