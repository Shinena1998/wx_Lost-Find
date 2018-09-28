package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.OperateMysql;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperateRespository extends JpaRepository<OperateMysql,Long> {

}
