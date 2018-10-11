package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.HistoryMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistoryRepository extends JpaRepository<HistoryMysql,Integer> {
    public HistoryMysql findByOpenid(String openid);
}
