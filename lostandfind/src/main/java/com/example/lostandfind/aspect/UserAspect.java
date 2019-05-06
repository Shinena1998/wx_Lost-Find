package com.example.lostandfind.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Aspect
@Component
public class UserAspect {

    private static final Logger logger = LoggerFactory.getLogger(UserAspect.class);


    private long timestamp;
    @Pointcut("execution(public *  com.example.lostandfind.controller.LafController.*(..))")
    public void log(){
    }
    @Before("log()")
    public void doBefore(JoinPoint joinPoint){
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        timestamp = new Date().getTime();
    }
    @After("log()")
    public void doAfter(JoinPoint joinPoint){
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        HttpServletResponse response = servletRequestAttributes.getResponse();
        String ip;
        /**
         * 此处，获取ip,当x-forwarded-for为null时，表示请求没有经过处理，此时调用getRemoteAddr（）和getRemoteHost（）都可获取真实ip
         * 反之，则getHeader（"x-forwarded-for"）为真实的ip。
         */
        if (request.getHeader("x-forwarded-for") == null) {
            ip = request.getRemoteAddr();
        }else {
            ip = request.getHeader("x-forwarded-for");
        }
        timestamp = new Date().getTime() - timestamp;
        //method,getRequestURL整个url连接；getRequestURI只有端口后端的
        logger.info("url={};method={};ip={};classMethod={};time={}ms;",
                request.getRequestURL(),request.getMethod(),ip,joinPoint.getSignature().getDeclaringTypeName()+"."+joinPoint.getSignature().getName(),
                timestamp);

    }

    @AfterReturning(returning = "object",pointcut = "log()")
    public void doAfterRetuening(Object object){

    }
}
