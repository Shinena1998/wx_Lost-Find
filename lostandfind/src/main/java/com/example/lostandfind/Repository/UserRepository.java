package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.UserMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserMysql,Integer> {
}
