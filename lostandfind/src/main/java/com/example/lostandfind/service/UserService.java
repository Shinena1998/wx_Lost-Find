package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import com.example.lostandfind.repository.UserRepository;
import com.example.lostandfind.utils.ResultUtil;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Transactional
    public Result addCollect(JSONObject jsonObject){
        int num = jsonObject.getInteger("num");
        InfoMysql info = jsonObject.getObject("info",InfoMysql.class);
        UserMysql user  = userRepository.findById(num).get();
        List<InfoMysql> infos = user.getInfos();
        infos.add(info);
        user.setInfos(infos);
        userRepository.save(user);
        return ResultUtil.success();
    }

    public Result removeCollect(int num,int infoId){
        UserMysql user  = userRepository.findById(num).get();
        List<InfoMysql> infos = user.getInfos();
        for (int i = 0; i < infos.size(); i++) {
            if(infos.get(i).getId() == infoId){
                infos.remove(i);
            }
        }
        user.setInfos(infos);
        userRepository.save(user);
        return ResultUtil.success();
    }

    @Transactional
    public Result writeFormId(JSONObject jsonObject){
        int id = jsonObject.getInteger("id");
        String formid = jsonObject.getString("formId");
        userRepository.writeFormId(formid,id);
        return ResultUtil.success();
    }
}
