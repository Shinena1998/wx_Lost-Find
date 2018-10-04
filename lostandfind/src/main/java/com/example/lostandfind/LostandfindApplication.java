package com.example.lostandfind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LostandfindApplication {

    public static void main(String[] args) {
        SpringApplication.run(LostandfindApplication.class, args);
    }
}
