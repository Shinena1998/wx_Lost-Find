package com.example.lostandfind.worker;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WorkerConfigruation {
    @Bean
    public Channel setWorker(){
        Channel channel = new Channel(1);
        channel.startWorkers();
        return channel;
    }
}
