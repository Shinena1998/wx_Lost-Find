package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<UserMysql,Integer> {
    public UserMysql findByOpenId(String openId);
}
