package com.example.lostandfind.interceptor;


import com.example.lostandfind.utils.SessionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisClusterConnection;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisSentinelConnection;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.time.Duration;

public class CheckLoginInterceptor implements HandlerInterceptor {
    private final String url = "/token";

    //在before前
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("这是拦截器");
//        if(request.getRequestURI().equals(url)){
//            return true;
//        }else {

//            SessionUtil sessionUtil = SessionUtil.getInstance();
//            HttpSession session = sessionUtil.getSession(request.getHeader("sessionId"));
//            if(session != null){
//                if(request.getHeader("token").equals(session.getAttribute("token"))){
//                    return true;
//                }else {
//                    return false;
//                }
//            } else {
//                return false;
//            }
//        }

        return true;
//        if(request.getRequestURI().equals(url)){
//            return true;
//        }else {
//            template.opsForValue().set("sd","asd", Duration.ofDays(2));
//            if(template.hasKey(request.getHeader("openid"))){
//                if(request.getHeader("token").equals(template.opsForValue().get(request.getHeader("openid")))){
//                    return true;
//                }else {
//                    return false;
//                }
//            }else{
//                return false;
//            }
//        }
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
}
