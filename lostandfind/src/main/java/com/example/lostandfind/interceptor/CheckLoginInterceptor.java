package com.example.lostandfind.interceptor;


import com.example.lostandfind.utils.SessionUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisClusterConnection;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConnection;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.time.Duration;
@Component
public class CheckLoginInterceptor implements HandlerInterceptor {
    private final String url = "/token";
    private static final Logger logger = LoggerFactory.getLogger(CheckLoginInterceptor.class);

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    //在before前
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        response.setContentType("text/html;charset=utf-8");
//        String key = request.getHeader("openid");
//        String token = request.getHeader("token");
//        if(key == null){
//            response.getWriter().print("别试了，进不去的。");
//            return false;
//        }else if(token.equals(stringRedisTemplate.opsForValue().get(key))){
//            return true;
//        }else {
//            response.getWriter().print("你就是构造了token也没用啊");
//            return false;
//        }
        return true;
    }
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
       //logger.info("postHandle");在before后
        System.out.println("这是postHandle");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
        //logger.info("afterCompletion");
    }
    public CheckLoginInterceptor(){
        logger.info("这是拦截器");
    }
}
