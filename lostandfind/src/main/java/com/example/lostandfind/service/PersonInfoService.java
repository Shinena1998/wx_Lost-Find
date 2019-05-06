package com.example.lostandfind.service;

import com.example.lostandfind.mysql.PersonInfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import com.example.lostandfind.repository.PersonInfoRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonInfoService {
    @Autowired
    private PersonInfoRespository personInfoRespository;
    public PersonInfoMysql getPersonInfo(int id){
        UserMysql userMysql = new UserMysql();
        userMysql.setNum(id);
        PersonInfoMysql p = personInfoRespository.findByUser(userMysql);
        if(p!=null){
            p.getUser();
        }
        return p;
    }
}
