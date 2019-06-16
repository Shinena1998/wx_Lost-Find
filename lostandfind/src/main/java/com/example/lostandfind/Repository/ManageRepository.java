package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.ManagerMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ManageRepository extends JpaRepository<ManagerMysql,Long> {
    public ManagerMysql findByOpenId(String openid);

    @Modifying
    @Query(value = "update manager_mysql set form_id = ?1 where open_id = ?2",nativeQuery = true)
    int updataFormId(String formId,String openId);

    //获得超级管理员密码
    @Query(value = "select password from super_manager where username = ?1",nativeQuery = true)
    String getSuperManager(String username);

}
