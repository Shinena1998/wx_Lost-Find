package com.example.lostandfind;

import com.example.lostandfind.interceptor.CheckLoginInterceptor;
import com.example.lostandfind.mysql.GradeMysql;
import com.example.lostandfind.redis.RedisSave;
import com.example.lostandfind.repository.GradeRepository;
import com.example.lostandfind.utils.SessionListener;
import com.example.lostandfind.utils.SessionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import com.github.pagehelper.PageHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.jca.context.SpringContextResourceAdapter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.mybatis.spring.annotation.*;

import java.util.Properties;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
//@MapperScan("com.example.lostandfind.mapper")
public class LostandfindApplication {
    private static final Logger logger = LoggerFactory.getLogger(LostandfindApplication.class);

    public static void main(String[] args) {
         SpringApplication.run(LostandfindApplication.class, args);
    }
    @Configuration
    public class InterceptorConfig implements WebMvcConfigurer {
//        @Bean
//        public HandlerInterceptor getCheckLoginInterceptor(){
//            return new CheckLoginInterceptor();
//        }
        @Autowired
        CheckLoginInterceptor checkLoginInterceptor;
        /**
         * addPathPatterns添加需要拦截的命名空间；
         * excludePathPatterns添加排除拦截命名空间
         * @param registry
         */
        @Override
        public void addInterceptors(InterceptorRegistry registry) {
            logger.info("初始化拦截器");
            registry.addInterceptor(checkLoginInterceptor)
                    .addPathPatterns("/**")
                    .excludePathPatterns("/token")
                    .excludePathPatterns("/getUserInfo")
                    .excludePathPatterns("/createIndex")
                    .excludePathPatterns("/getInfo1");
        }
    }
    //注册session监听器;
    @Bean
    public ServletListenerRegistrationBean<SessionListener> servletListenerRegistrationBean() {
        ServletListenerRegistrationBean<SessionListener> slrBean = new ServletListenerRegistrationBean<SessionListener>();
        slrBean.setListener(new SessionListener());
        return slrBean;
    }
    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = jsonConverter.getObjectMapper();
        Hibernate5Module hibernate5Module  = new Hibernate5Module();
//  hibernate5Module.configure(Hibernate5Module.Feature.USE_TRANSIENT_ANNOTATION, false);
        objectMapper.registerModule(hibernate5Module);
        return jsonConverter;
    }

}
