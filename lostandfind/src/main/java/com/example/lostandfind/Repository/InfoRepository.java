package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfoRepository extends JpaRepository<InfoMysql,Integer> {
}
