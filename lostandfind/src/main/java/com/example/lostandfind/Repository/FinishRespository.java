package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.FinishMysql;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface
FinishRespository extends JpaRepository<FinishMysql,Integer> {
    public List<FinishMysql> findByIdentityAndTimeOut(String openid,boolean timeout);

    @Query(value = "select count(id) from  finish_mysql where identity=?1 and time_out=0",nativeQuery = true)
    int finishCount(String openid);

    @Query(value = "select * from finish_mysql where push >= ?1 and push <= ?2 order by id desc",nativeQuery = true)
    List<FinishMysql> getSearchFinish(String start , String end);
}
