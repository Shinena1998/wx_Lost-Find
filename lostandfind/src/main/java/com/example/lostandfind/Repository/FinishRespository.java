package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.FinishMysql;
import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FinishRespository extends JpaRepository<FinishMysql,Integer> {
    public List<FinishMysql> findByIdentity(String openid);
}
