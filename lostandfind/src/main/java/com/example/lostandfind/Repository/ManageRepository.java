package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.ManagerMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManageRepository extends JpaRepository<ManagerMysql,Long> {
    public ManagerMysql findByOpenId(String openid);
}
