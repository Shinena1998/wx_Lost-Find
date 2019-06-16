package com.example.lostandfind;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.ManagerMysql;
import com.example.lostandfind.utils.DivideWord;
import javafx.application.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.concurrent.TimeUnit;

@RunWith(SpringRunner.class) //底层为Junit4
@SpringBootTest(classes=LostandfindApplication.class) //启动类
public class LostandfindApplicationTests {

}
