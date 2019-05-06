package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.ThanksMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThanksRepository extends JpaRepository<ThanksMysql,Integer> {
}
