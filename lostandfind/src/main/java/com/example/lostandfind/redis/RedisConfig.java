package com.example.lostandfind.redis;

import java.lang.reflect.Method;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import com.example.lostandfind.mapper.InfoMapper;
import com.example.lostandfind.mysql.InfoMysql;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Component;

/**
 * 这个主要是根据redis存储的数据类型需求决定，key一般都是String，但是value可能不一样，一般有两种，String和 Object； 
 * 如果k-v都是String类型，我们可以直接用 StringRedisTemplate，这个是官方建议的，也是最方便的，直接导入即用，无需多余配置！ 
 * 如果k-v是Object类型，则需要自定义 RedisTemplate
 */
@Configuration
// 必须加，使配置生效
@EnableCaching
@Component
public class RedisConfig extends CachingConfigurerSupport {
    private static final Logger logger = LoggerFactory.getLogger(RedisConfig.class);

    //Spring.data.Redis消息订阅
    //初始化监听器
//    @Bean
//    RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
//                                            MessageListenerAdapter listenerAdapter) {
//
//        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
//        container.setConnectionFactory(connectionFactory);
//        container.addMessageListener(listenerAdapter, new PatternTopic("chat"));
//        return container;
//    }
    //消息监听器
    //利用反射来创建监听到消息之后的执行方法
//    @Bean
//    MessageListenerAdapter listenerAdapter(Receiver receiver) {
//        return new MessageListenerAdapter(receiver, "receiveMessage");
//    }

    /**
     * 创建监听之后的receiver方法类
     * 这里是收到通道的消息之后执行的方法
     * @param latch
     * @return
     */
//    @Bean
//    Receiver receiver(CountDownLatch latch) {
//        return new Receiver(latch);
//    }
    /**
     * CountDownLatch是一个同步辅助类，犹如倒计时计数器，创建对象时通过构造方法设置初始值
     * 调用CountDownLatch对象的await()方法则使当前线程处于等待状态，
     * 调用countDown()方法就将计数器减1，当计数到达0时，则所有等待线程全部开始执行。
     *  public CountDownLatch(int count);   //构造方法参数指定了计数的次数
     *  public void countDown();    //当前线程调用此方法，则计数减一
     *  public void await() throws InterruptedException;//调用此方法会一直阻塞当前线程，直到计时器的值为0
     * 它提供的常用方法：
     * @return
     */
//    @Bean
//    CountDownLatch latch() {
//        return new CountDownLatch(1);//初始为1
//    }

    /**
     * 生成key的策略 根据类名+方法名+所有参数的值生成唯一的一个key
     * method 方法
     */
    @Bean
    @Override
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            public Object generate(Object target, Method method, Object... params) {
                StringBuilder sb = new StringBuilder();
                sb.append(target.getClass().getName());
                sb.append(method.getName());
                for (Object obj : params) {
                    sb.append(obj.toString());
                }
                return sb.toString();
            }
        };
    }
    @Autowired
    private JedisConnectionFactory jedisConnectionFactory;
    /**
     * 管理缓存
     * @param redisTemplate
     * @return
     */
    @SuppressWarnings("rawtypes")
    @Bean
    public CacheManager cacheManager() {
        RedisCacheManager.RedisCacheManagerBuilder builder = RedisCacheManager
                .RedisCacheManagerBuilder
                .fromConnectionFactory(jedisConnectionFactory);
        return builder.build();
    }
    //然后需要配置类序列化对象。（如果没有存储的是乱码）
    //JedisConnectionFactory是RedisConnectionFactory的子类
    @Bean
    public RedisTemplate<String, InfoMysql> RedisTemplate(JedisConnectionFactory connectionFactory) {
        logger.info("redis被加入到bean");
        RedisTemplate<String,InfoMysql> template = new RedisTemplate<String,InfoMysql>();
        Jackson2JsonRedisSerializer<InfoMysql> j2 = new Jackson2JsonRedisSerializer<InfoMysql>(InfoMysql.class);
        //value值得序列化采用fastJsonRedisSerializer
        template.setValueSerializer(j2);
        template.setHashValueSerializer(j2);
        //key值得序列化采用StringRedisSerializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setConnectionFactory(connectionFactory);
        template.afterPropertiesSet();
        return template;
    }

    /**
     * 此bean无用，
     * 初始化一个zset的数据结构，用于寻找推荐词
     * afterPropertiesSet此方法作用比bean的初始化
     * redis使用前必须连接setConnectionFactory
     * @param connectionFactory
     * @return
     * Bean添加name属性，需要使用@Resource(name = "redisSearch"
     * 这样可以配置多个redisTemplate
     */
    @Bean(name = "redisSearch")
    public StringRedisTemplate redisSearch(JedisConnectionFactory connectionFactory){
        StringRedisTemplate stringRedisTemplate = new StringRedisTemplate();

        stringRedisTemplate.setConnectionFactory(connectionFactory);
        stringRedisTemplate.afterPropertiesSet();
        stringRedisTemplate.opsForZSet().add("search","init",0);
        return stringRedisTemplate;
    }

//    public class Receiver {
//        private CountDownLatch latch;
//
//        @Autowired
//        private Receiver(CountDownLatch latch) {
//            this.latch = latch;
//        }
//
//        public void receiveMessage(String message) {
//            latch.countDown(); //减一
//        }
//    }
}
