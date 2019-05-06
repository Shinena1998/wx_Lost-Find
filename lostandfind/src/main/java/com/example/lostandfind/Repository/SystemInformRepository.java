package com.example.lostandfind.repository;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.SystemInformMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SystemInformRepository extends JpaRepository<SystemInformMysql,Integer> {

    @Query(value = "SELECT user_id from report_user where report_report_id=?1",nativeQuery = true)
    List<JSONObject> selectInfoInformer(int id);

    @Query(value = "SELECT user_id from comment_user where reportcomment_report_id=?1",nativeQuery = true)
    List<JSONObject> selectCommentInformer(int id);

    @Query(value = "SELECT count(reported) from inform where (informer=?1 or reported=?2) and look=false",nativeQuery = true)
    int informCount(int id,String reported);

    List<SystemInformMysql> findByInformerOrReportedOrderByIdDesc(int id ,String openid);

    @Modifying
    @Query(value = "update inform set look=true where id in ?1",nativeQuery = true)
    int markRead(List<Integer> ids);
}
