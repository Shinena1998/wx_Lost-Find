package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.FinishMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinishRespository extends JpaRepository<FinishMysql,Integer> {
}
