package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.NewsMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface NewsRepository extends JpaRepository<NewsMysql,Integer> {

}
