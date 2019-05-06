package com.example.lostandfind.mysql;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.persistence.*;

@Entity
@Repository
public class ManagerMysql {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String openId;
    private String formId;

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

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
