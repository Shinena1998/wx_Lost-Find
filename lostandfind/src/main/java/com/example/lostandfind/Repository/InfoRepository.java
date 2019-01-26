package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InfoRepository extends JpaRepository<InfoMysql,Integer> {
    public List<InfoMysql> findByIdentity(String openid);

    //得到重要物品
    public List<InfoMysql> findByIsValuableAndABoolean(boolean b,boolean c);
    //得到证件类
    public List<InfoMysql> findByCategory(String category);
    public List<InfoMysql> findByABooleanAndIsValuableOrderByTimestampsDesc(boolean aBoolean , boolean valuable);

    //原因是limit属于MySQL特有的特性，而@Query默认只接受通用SQL。
    //解决方法是简单地加上nativeQuery = true即可。

    //从redis那完后再从数据库直接拿，count代表页码，一般物品的标记为is_valuable=0
    @Query(value="select * from info_mysql where is_valuable=false order by id asc limit ?1,50",nativeQuery = true)
    public List<InfoMysql> findByABoolean(int count);

    @Query(value="select * from info_mysql " +
            "where is_valuable=false and (theme like %?1% or time like %?1% or place like %?1% or infomation like %?1%)" +
            "order by id desc limit ?2,10",nativeQuery = true)
    public List<InfoMysql> findByInfoTheme(String name,int count);

    //redis获得普通物品
    @Query(value="select * from info_mysql where is_valuable=false order by id asc limit 0,200",nativeQuery = true)
    public List<InfoMysql> getinfo();
    //redis获得贵重物品
    @Query(value="select * from info_mysql where is_valuable=true and a_boolean=true order by id asc",nativeQuery = true)
    public List<InfoMysql> getValuableinfo();
}
