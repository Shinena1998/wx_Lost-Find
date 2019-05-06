package com.example.lostandfind.repository;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.PushMysql;
import com.example.lostandfind.sqlInterface.PushInterface;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface PushRepository extends JpaRepository<PushMysql,Integer> {
    @Query(value = "select count(name) FROM push WHERE name=?1 and look=?2",nativeQuery = true)
    int name(String name,boolean look);

    List<PushInterface> findByNameAndLookOrderByIdDesc(String name,boolean look);

    //标记已读
    @Modifying
    @Query(value="update push set look=?1 where id=?2",nativeQuery = true)
    int hasLook(boolean look , int id);

    //测试关联部分查询
    @Query(value = "select p.info.theme, p.name from push p where p.name=?1")
    List<PushMysql> test(String name);

    //测试关联部分查询
    @Query(value = "select new map(p.info.theme as theme, p.name as name) from push p where p.name=?1")
    List<Map<String, Object>> test2(String name);
    //测试部分查询
    @Query(value="select name,look from push where name=?1",nativeQuery = true)
    List<JSONObject> test3(String name);
}
