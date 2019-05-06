package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<UserMysql,Integer> {
    public List<UserMysql> findByOpenId(String openId);

    @Query(value = "select u.infos from user u where u.id=?1")
    List<InfoMysql> searchCollect(int num);
    @Modifying
    @Query(value = "update user u set u.infos =?1 where u.id=?2")
    int updateCollect(List<InfoMysql> infos, int num);

    @Query(value="select user_num from user_info where user_num=?1 and info_mysql_id=?2",nativeQuery = true)
    Object hasCollect(int num,int infoId);

    @Modifying
    @Query(value = "update user set form_id =?1 where num=?2",nativeQuery = true)
    int writeFormId(String formId, int num);
}
