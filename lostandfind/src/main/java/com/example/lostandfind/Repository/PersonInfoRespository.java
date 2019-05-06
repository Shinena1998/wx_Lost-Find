package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.PersonInfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonInfoRespository extends JpaRepository<PersonInfoMysql,Long> {
//    public PersonInfoMysql findByOpenid(String openid);
    public PersonInfoMysql findByUser(UserMysql userId);

    public List<PersonInfoMysql> findByName(String name);
}
