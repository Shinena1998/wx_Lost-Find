package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InfoRepository extends JpaRepository<InfoMysql,Integer> {
    public List<InfoMysql> findByIsValuable(boolean b);
    public List<InfoMysql> findByABooleanAndFinalConfirmAndIsValuable(boolean aBoolean,boolean finalConfirm,boolean isValuable);
}
