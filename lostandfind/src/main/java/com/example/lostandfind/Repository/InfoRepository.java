package com.example.lostandfind.Repository;

import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InfoRepository extends JpaRepository<InfoMysql,Integer> {
    public List<InfoMysql> findByIsValuable(boolean b);
    public List<InfoMysql> findByABooleanAndFinalConfirmAndIsValuableAndTimeOut(boolean aBoolean,boolean finalConfirm,boolean isValuable,boolean timeOut);
    @Query("select o from InfoMysql o where o.theme like %:name% ")
    public List<InfoMysql> findByInfoTheme(@Param("name") String name);
    @Query("select o from InfoMysql o where o.Time like %:name% ")
    public List<InfoMysql> findByInfoTime(@Param("name") String name);
    @Query("select o from InfoMysql o where o.place like %:name% ")
    public List<InfoMysql> findByInfoPlace(@Param("name") String name);
    @Query("select o from InfoMysql o where o.infomation like %:name% ")
    public List<InfoMysql> findByInfoInfomation(@Param("name") String name);

}
