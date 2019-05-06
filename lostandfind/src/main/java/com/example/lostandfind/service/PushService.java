package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.PushMysql;
import com.example.lostandfind.repository.PushRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
public class PushService {
    @Autowired
    private PushRepository pushRepository;

    @Transactional
    public String writePush(JSONObject jsonObject){
        pushRepository.hasLook(true,jsonObject.getInteger("id"));
        return "successful";
    }

}