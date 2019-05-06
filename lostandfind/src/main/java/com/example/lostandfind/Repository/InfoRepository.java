package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Set;

public interface InfoRepository extends JpaRepository<InfoMysql,Integer> {
    @EntityGraph(value = "info.all" , type= EntityGraph.EntityGraphType.FETCH)
    public List<InfoMysql> findByIdentity(String openid);

    //得到重要物品
    public List<InfoMysql> findByIsValuableAndABoolean(boolean b,boolean c);
    //贵重物品个数
    @Query(value = "select COUNT(*) from info_mysql where is_valuable=true and a_boolean=false",nativeQuery = true)
    int valuableCount();
    //得到证件类
    public List<InfoMysql> findByCategory(String category);

    //原因是limit属于MySQL特有的特性，而@Query默认只接受通用SQL。
    //解决方法是简单地加上nativeQuery = true即可。

    //从redis那完后再从数据库直接拿，count代表页码，一般物品的标记为is_valuable=0
    @Query(value="select * from info_mysql where is_valuable=false order by id asc limit ?1,50",nativeQuery = true)
    public List<InfoMysql> findByABoolean(int count);

    @Query(value="select * from info_mysql " +
            "where is_valuable=false and (theme like %?1% or time like %?1% or place like %?1% or infomation like %?1%)" +
            "order by id desc limit ?2,10",nativeQuery = true)
    public List<InfoMysql> findByInfoTheme(String name,int count);

    //获取贵重物品
    @EntityGraph(value = "info.all" , type= EntityGraph.EntityGraphType.FETCH)
    public List<InfoMysql> findByABooleanAndIsValuableOrderByTimestampsDesc(boolean aBoolean , boolean valuable);

    //测试
    @Query(value = "select * from info_mysql where a_boolean=true and is_valuable=true",nativeQuery = true)
    public List<InfoMysql> test();
    //获得普通物品
    @EntityGraph(value = "info.all" , type= EntityGraph.EntityGraphType.FETCH)
    public List<InfoMysql> findByIsValuableOrABooleanOrderByIdDesc(boolean va,boolean ab , Pageable pageable);
    //获得贵重物品
    @EntityGraph(value = "info.all" , type= EntityGraph.EntityGraphType.FETCH)
    public List<InfoMysql> findByIsValuableAndABooleanOrderById(boolean b, boolean c);

    //获得举报信息数据
    @Query(value = "select * from info_mysql where id in ?1",nativeQuery = true)
    public List<InfoMysql> findidIn(Set<Integer> ids);

    //获得搜索数据
    @Query(value = "select * from info_mysql where id in ?1",nativeQuery = true)
    public List<InfoMysql> searchInfo(Set<Integer> ids);

    @Query(value = "select count(id) from  info_mysql where identity=?1",nativeQuery = true)
    int infoCount(String openid);
}
