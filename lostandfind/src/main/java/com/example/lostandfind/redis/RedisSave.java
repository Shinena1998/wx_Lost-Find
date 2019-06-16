package com.example.lostandfind.redis;

import com.example.lostandfind.LostandfindApplication;
import com.example.lostandfind.mysql.GradeMysql;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.GradeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RedisSave {
    @Autowired
    private RedisTemplate<String,InfoMysql> redisTemplate;

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
    public String saveValuableInfo(InfoMysql infoMysql, RedisTemplate<String,InfoMysql> redisTemplate){
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
            redisTemplate.opsForValue().set(openid,token,Duration.ofHours(2).toHours());
        }
    }
    private static final Logger logger = LoggerFactory.getLogger(RedisSave.class);

//    @Autowired
//    private GradeRepository gradeRepository;
////    @Autowired
////    private RedisTemplate stringRedisTemplate;
////    @PostConstruct
////    public void loadGrade(){
////        GradeMysql gradeMysql = gradeRepository.findById(1).get();
////        Map<String,Integer> map = new HashMap<>();
////        map.put("rInfoAddGrade",gradeMysql.getrInfoAddGrade());
////        map.put("rInfoReduceGrade",gradeMysql.getrInfoReduceGrade());
////        map.put("rCommentAddGrade",gradeMysql.getrCommentAddGrade());
//        map.put("rCommentReduceGrade",gradeMysql.getrCommentReduceGrade());
//        map.put("pushInfoGrade",gradeMysql.getPushInfoGrade());
//        map.put("remindInfoGrade",gradeMysql.getRemindInfoGrade());
//        map.put("finishInfoGrade",gradeMysql.getFinishInfoGrade());
//        stringRedisTemplate.opsForValue().set("rInfoAddGrade","asd");
////        stringRedisTemplate.opsForHash().put("grade","finishInfoGrade",gradeMysql.getFinishInfoGrade());
//        logger.info("初始化执行函数，通过"+stringRedisTemplate.opsForValue().get("rInfoAddGrade"));
//    }
}
