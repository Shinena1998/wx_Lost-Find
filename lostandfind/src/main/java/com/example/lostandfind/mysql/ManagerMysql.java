package com.example.lostandfind.mysql;

import org.springframework.stereotype.Component;

import javax.persistence.*;

@Entity
@Component
public class ManagerMysql {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String openId;

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }
}
