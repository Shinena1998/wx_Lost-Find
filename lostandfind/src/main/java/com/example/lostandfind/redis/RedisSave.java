package com.example.lostandfind.redis;

import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class RedisSave {
//    @Autowired 注入失败
//    private RedisTemplate<String,InfoMysql> redisTemplate;

    final static int length = 200;
    //向Redis添加普通物品
    public String saveInfo(InfoMysql infoMysql,boolean haskey ,RedisTemplate<String,InfoMysql> redisTemplate){
        /**
         * 因为需要一中key value型的数据类型来存储数据，
         */
        if(haskey){
            if(redisTemplate.opsForList().size("infoN") <= 200){
                //将所有指定的值插入存储在键的列表的头部。如果键不存在，则在执行推送操作之前将其创建为空列表。
                redisTemplate.opsForList().rightPush("infoN",infoMysql);
            }else{
                //弹出最左边的元素，弹出之后该值在列表中将不复存在
                redisTemplate.opsForList().leftPop("infoN");
                redisTemplate.opsForList().rightPush("infoN",infoMysql);
            }
        }else {
            redisTemplate.opsForList().rightPush("infoN",infoMysql);
        }
//        redisTemplate.opsForValue().set(infoMysql.getId().toString(),infoMysql, Duration.ofDays(3));
        return "添加成功";
    }
    //向Redis添加贵重物品
    public String saveValuableInfo(InfoMysql infoMysql,RedisTemplate<String,InfoMysql> redisTemplate){
        /**
         * 因为需要一中key value型的数据类型来存储数据，
         */
         redisTemplate.opsForList().rightPush("infoV",infoMysql);
//        redisTemplate.opsForValue().set(infoMysql.getId().toString(),infoMysql, Duration.ofDays(3));
        return "添加成功";
    }

    //从Redis获取普通物品
    public List<InfoMysql> getInfo(RedisTemplate<String,InfoMysql> redisTemplate){
        return redisTemplate.opsForList().range("infoN",0,-1);

    }
    //从Redis获取贵重物品
    public List<InfoMysql> getValuableInfo(RedisTemplate<String,InfoMysql> redisTemplate){
        return redisTemplate.opsForList().range("infoV",0,-1);
    }
    public void token(RedisTemplate redisTemplate,String openid,String token){
        if(redisTemplate.hasKey(openid)){

        }else{
            redisTemplate.opsForValue().set(openid,token, Duration.ofHours(2));
        }
    }

}
