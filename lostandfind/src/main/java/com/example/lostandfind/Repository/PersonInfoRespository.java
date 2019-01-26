package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.PersonInfoMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonInfoRespository extends JpaRepository<PersonInfoMysql,Long> {
    public PersonInfoMysql findByOpenid(String openid);
}
