package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.CommentMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRespository extends JpaRepository<CommentMysql,Integer> {
}
