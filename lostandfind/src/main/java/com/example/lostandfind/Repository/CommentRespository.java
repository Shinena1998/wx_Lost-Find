package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.CommentMysql;
import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface CommentRespository extends JpaRepository<CommentMysql,Integer> {
//    @EntityGraph(value = "info.all" , type= EntityGraph.EntityGraphType.FETCH)
    public List<CommentMysql> findByInfoOrderByIdDesc(InfoMysql info);
//    @EntityGraph(value = "info.all" , type= EntityGraph.EntityGraphType.FETCH)
//    public List<CommentMysql> findByIdIn(List<Integer> ids);

    //加上次注解会有异常，原因不详
//    @EntityGraph(value = "info.all" , type= EntityGraph.EntityGraphType.FETCH)
    public List<CommentMysql> findByToUidOrderByIdDesc(String toUid);
    public List<CommentMysql> findByToUidAndToViewOrderByIdDesc(String toUid,boolean toview);
    public List<CommentMysql> findByIdentityOrderByIdDesc(String openid);
    public List<CommentMysql> findByIdentityAndViewOrderByIdDesc(String openid,boolean view);
    @Query(value = "select * from comment_mysql where id in ?1",nativeQuery = true)
    public List<CommentMysql> findidIn(List<Integer> ids);
}
