package com.example.lostandfind.interceptor;


import com.example.lostandfind.utils.SessionUtil;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class CheckLoginInterceptor implements HandlerInterceptor {
    private final String url = "/token";

    //在before前
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if(request.getRequestURI().equals(url)){
            return true;
        }else {
            SessionUtil sessionUtil = SessionUtil.getInstance();
            HttpSession session = sessionUtil.getSession(request.getHeader("sessionId"));
            if(session.getAttribute("token") != null){
                if(request.getHeader("token").equals(session.getAttribute("token"))){
                    return true;
                }else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
       //logger.info("postHandle");在before后
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
        //logger.info("afterCompletion");
    }
}
