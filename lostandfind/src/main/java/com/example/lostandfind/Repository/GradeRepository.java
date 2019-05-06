package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.GradeMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GradeRepository extends JpaRepository<GradeMysql, Integer> {

}
