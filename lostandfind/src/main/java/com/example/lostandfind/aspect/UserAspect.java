package com.example.lostandfind.aspect;

import com.example.lostandfind.Repository.OperateRespository;
import com.example.lostandfind.mysql.HistoryMysql;
import com.example.lostandfind.mysql.ManagerMysql;
import com.example.lostandfind.mysql.OperateMysql;
import com.example.lostandfind.service.TokenService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import sun.tools.jstat.Token;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
import java.util.Random;

@Aspect
@Component
public class UserAspect {
    private static final Logger logger = LoggerFactory.getLogger(UserAspect.class);

    @Autowired
    private OperateRespository operateRespository;

    @Pointcut("execution(public *  com.example.lostandfind.controller.LafController.*(..))")
    public void log(){
    }
    @Before("log()")
    public void doBefore(JoinPoint joinPoint){
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        //url
        logger.info("url={}",request.getRequestURL());
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
        //method
        logger.info("method={}",request.getMethod());
        //ip
        logger.info("ip={}",request.getRemoteAddr());
        //类方法
        logger.info("class_method={}",joinPoint.getSignature().getDeclaringTypeName()+" "+joinPoint.getSignature().getName());
        //参数

        logger.info("args={}",joinPoint.getArgs());
        OperateMysql operateMysql = new OperateMysql();
        operateMysql.setUrl(request.getRequestURI());
        operateMysql.setIp(ip);
        operateMysql.setClassMethod(joinPoint.getSignature().getDeclaringTypeName()+" "+joinPoint.getSignature().getName());
        operateRespository.save(operateMysql);
    }
    @After("log()")
    public void doAfter(JoinPoint joinPoint){

    }

    @AfterReturning(returning = "object",pointcut = "log()")
    public void doAfterRetuening(Object object){
    }
}
