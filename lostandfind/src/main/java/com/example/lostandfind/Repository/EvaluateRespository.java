package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.EvaluateMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluateRespository extends JpaRepository<EvaluateMysql,Integer> {
    public EvaluateMysql findByOpenid(String openid);
}
