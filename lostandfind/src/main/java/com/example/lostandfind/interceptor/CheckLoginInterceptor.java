package com.example.lostandfind.interceptor;

import com.example.lostandfind.aspect.UserAspect;
import com.example.lostandfind.service.TokenService;
import com.example.lostandfind.utils.SessionUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class CheckLoginInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(CheckLoginInterceptor.class);
    private final String url = "/token";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {


        logger.info("url={}",request.getRequestURI());
        if(request.getRequestURI().equals(url)){
            return true;
        }else {
            SessionUtil sessionUtil = SessionUtil.getInstance();
            logger.info(request.getHeader("sessionId"));
            HttpSession session = sessionUtil.getSession(request.getHeader("sessionId"));
            logger.info("token3={}",session.getId());
            logger.info("token3={}",session.getAttribute("token"));
            if(request.getHeader("token").equals(session.getAttribute("token"))){
                return true;
            }else {
                logger.info("token4={}","false");
                return false;
            }
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
       logger.info("postHandle");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
        logger.info("afterCompletion");
    }
}
