package com.example.lostandfind;

import com.example.lostandfind.interceptor.CheckLoginInterceptor;
import com.example.lostandfind.utils.SessionListener;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import com.thetransactioncompany.cors.CORSConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;


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
                    .excludePathPatterns("/getInfo1")
                    .excludePathPatterns("/manager/**");
        }
    }
    //解决http跨域
    @Configuration
    public class CorsConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {

            registry
                    .addMapping("/**")
                    .allowedMethods("OPTIONS", "GET", "PUT", "POST", "DELETE")
                    .allowedOrigins("*")
                    .allowedHeaders("*");
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
        Hibernate5Module hibernate5Module = new Hibernate5Module();
//  hibernate5Module.configure(Hibernate5Module.Feature.USE_TRANSIENT_ANNOTATION, false);
        objectMapper.registerModule(hibernate5Module);
        return jsonConverter;
    }
}
