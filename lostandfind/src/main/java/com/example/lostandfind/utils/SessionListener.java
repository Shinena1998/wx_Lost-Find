package com.example.lostandfind.utils;

import com.example.lostandfind.interceptor.CheckLoginInterceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@WebListener
public class SessionListener implements HttpSessionListener, HttpSessionAttributeListener {

    private static final Logger logger = LoggerFactory.getLogger(CheckLoginInterceptor.class);


    @Override
    public void attributeAdded(HttpSessionBindingEvent httpSessionBindingEvent) {
//        logger.info("--attributeAdded--");
        @SuppressWarnings("unused")
        HttpSession session = httpSessionBindingEvent.getSession();
//        logger.info("key----:" + httpSessionBindingEvent.getName());
//        logger.info("value---:" + httpSessionBindingEvent.getValue());

    }

    @Override
    public void attributeRemoved(HttpSessionBindingEvent httpSessionBindingEvent) {
//        logger.info("--attributeRemoved--");
    }

    @Override
    public void attributeReplaced(HttpSessionBindingEvent httpSessionBindingEvent) {
//        logger.info("--attributeReplaced--");
    }

    @Override
    public void sessionCreated(HttpSessionEvent event) {
//        logger.info("---sessionCreated----");
        HttpSession session = event.getSession();
        ServletContext application = session.getServletContext();
        // 在application范围由一个HashSet集保存所有的session
        @SuppressWarnings("unchecked")
        HashSet<HttpSession> sessions = (HashSet<HttpSession>) application.getAttribute("sessions");
        if (sessions == null) {
            sessions = new HashSet<HttpSession>();
            application.setAttribute("sessions", sessions);
        }
        // 新创建的session均添加到HashSet集中
        sessions.add(session);
        // 可以在别处从application范围中取出sessions集合
        // 然后使用sessions.size()获取当前活动的session数，即为“在线人数”

        //添加新建的session到MySessionContext中;
       SessionUtil.AddSession(event.getSession());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent event) throws ClassCastException {
//        logger.info("---sessionDestroyed----");
        HttpSession session = event.getSession();
//        logger.info("deletedSessionId: " + session.getId());
        System.out.println(session.getCreationTime());
        System.out.println(session.getLastAccessedTime());
        ServletContext application = session.getServletContext();
        HashSet<?> sessions = (HashSet<?>) application.getAttribute("sessions");
        // 销毁的session均从HashSet集中移除
        sessions.remove(session);

        //添加新建的session到MySessionContext中;
        SessionUtil.DelSession(session);
    }

}
