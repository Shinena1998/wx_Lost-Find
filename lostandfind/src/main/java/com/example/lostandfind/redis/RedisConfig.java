package com.example.lostandfind.redis;

import java.time.Duration;
import java.util.concurrent.CountDownLatch;

import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Component;

@Configuration
@EnableCaching
@Component
public class RedisConfig extends CachingConfigurerSupport {

    @Bean
    RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
                                            MessageListenerAdapter listenerAdapter) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, new PatternTopic("chat"));

        return container;
    }

    @Bean
    MessageListenerAdapter listenerAdapter(Receiver receiver) {
        return new MessageListenerAdapter(receiver, "receiveMessage");
    }
    @Bean
    Receiver receiver(CountDownLatch latch) {
        return new Receiver(latch);
    }

    @Bean
    CountDownLatch latch() {
        return new CountDownLatch(1);
    }

    @Bean
    public StringRedisTemplate StringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
    @Bean
    public RedisTemplate<String, InfoMysql> RedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String,InfoMysql> template = new RedisTemplate<String,InfoMysql>();
        Jackson2JsonRedisSerializer<InfoMysql> j2 = new Jackson2JsonRedisSerializer<InfoMysql>(InfoMysql.class);
        //value值得序列化采用fastJsonRedisSerializer
        template.setValueSerializer(j2);
        template.setHashValueSerializer(j2);
        //key值得序列化采用StringRedisSerializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        template.setConnectionFactory(connectionFactory);

        return template;
    }
    public class Receiver {


        private CountDownLatch latch;

        @Autowired
        public Receiver(CountDownLatch latch) {
            this.latch = latch;
        }

        public void receiveMessage(String message) {
            latch.countDown();
        }
    }
}
