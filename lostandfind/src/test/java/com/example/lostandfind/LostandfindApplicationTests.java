package com.example.lostandfind;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.ManagerMysql;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.concurrent.TimeUnit;

@RunWith(SpringRunner.class)
@SpringBootTest
public class LostandfindApplicationTests {
    @Autowired
    private RedisTemplate redisTemplate;
    @Test
    public void contextLoads() {
        ManagerMysql managerMysql = new ManagerMysql();
        managerMysql.setId((long)123);
        managerMysql.setOpenId("123dasdasdasd");
        ValueOperations<String,Object> operations = redisTemplate.opsForValue();
        redisTemplate.expire("name",20, TimeUnit.SECONDS);
        String key = "name";
        ManagerMysql managerMysql1 = (ManagerMysql) operations.get(key);
        System.out.println(managerMysql1);
    }

}
