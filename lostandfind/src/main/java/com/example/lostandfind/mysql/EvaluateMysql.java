package com.example.lostandfind.mysql;

import org.springframework.stereotype.Repository;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Repository
@Entity
public class EvaluateMysql {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String openid;
    private Integer uiL;
    private Integer useL;
    private Integer feelL;
    private Integer loadL;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public Integer getUiL() {
        return uiL;
    }

    public void setUiL(Integer uiL) {
        this.uiL = uiL;
    }

    public Integer getUseL() {
        return useL;
    }

    public void setUseL(Integer useL) {
        this.useL = useL;
    }

    public Integer getFeelL() {
        return feelL;
    }

    public void setFeelL(Integer feelL) {
        this.feelL = feelL;
    }

    public Integer getLoadL() {
        return loadL;
    }

    public void setLoadL(Integer loadL) {
        this.loadL = loadL;
    }
}
