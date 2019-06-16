package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.PersonInfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

//Integer影响的是那些deleteById()findById()的方法参数的类型
public interface PersonInfoRespository extends JpaRepository<PersonInfoMysql,Integer> {
//    public PersonInfoMysql findByOpenid(String openid);
    public PersonInfoMysql findByUser(UserMysql userId);

    public List<PersonInfoMysql> findByName(String name);

    @Query(value = "select * from person where user_num in ?1", nativeQuery = true)
    List<PersonInfoMysql> getManagerPersonInfo(List<Integer> num);

    PersonInfoMysql findByNum(String num);
}
