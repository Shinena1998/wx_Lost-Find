package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.UserMysql;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<UserMysql,Integer> {
    public List<UserMysql> findByOpenId(String openId);
}
