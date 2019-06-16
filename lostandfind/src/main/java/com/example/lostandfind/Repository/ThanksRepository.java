package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.ThanksMysql;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThanksRepository extends JpaRepository<ThanksMysql,Integer> {

    List<ThanksMysql> findByTypeOrderByIdDesc(int type);
}
