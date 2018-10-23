package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.SuggestMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SuggestRepository extends JpaRepository<SuggestMysql,Long> {
}
