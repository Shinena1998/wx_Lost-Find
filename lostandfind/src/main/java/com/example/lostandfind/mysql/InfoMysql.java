package com.example.lostandfind.mysql;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.stereotype.Component;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
@Component
@Entity
@EntityListeners(AuditingEntityListener.class)
@NamedQueries(value =
        {@NamedQuery(name="InfoMysql.findByInfoTheme",
                query = "select o from InfoMysql o"),
        @NamedQuery(name="InfoMysql.findByInfoTime",
                query = "select o from InfoMysql o"),
                @NamedQuery(name="InfoMysql.findByInfoPlace",
                        query = "select o from InfoMysql o"),
                @NamedQuery(name="InfoMysql.findByInfoInfomation",
                        query = "select o from InfoMysql o"),
        })

public class InfoMysql {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 事件种类
     */
    private String kind;

    /**
     * 物品名称
     */
    private String theme;
    /**
     * 是否是贵重物品
     */
    private boolean isValuable;

    private String identity;

    private String Time;

    private String category;
    //更新表时自动生成时间
    @CreatedDate
    private String current;

    private String picPath;

    private String contactWay;

    private String place;

    private String infomation;

    /**
     * 记录管理员是否同意审核
     */
    private boolean aBoolean;

    /**
     * 失主确认
     */
    private boolean isConfirm;

    private boolean finalConfirm;

    //更新时间
    @LastModifiedDate
    private String finalTime;

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean isValuable() {
        return isValuable;
    }

    public void setValuable(boolean valuable) {
        isValuable = valuable;
    }

    public boolean isFinalConfirm() {
        return finalConfirm;
    }

    public void setFinalConfirm(boolean finalConfirm) {
        this.finalConfirm = finalConfirm;
    }

    public boolean isConfirm() {
        return isConfirm;
    }

    public void setConfirm(boolean confirm) {
        isConfirm = confirm;
    }

    public String getCurrent() {
        return current;
    }

    public void setCurrent(String current) {
        this.current = current;
    }

    public String getTime() {
        return Time;
    }

    public void setTime(String time) {
        Time = time;
    }

    public boolean isaBoolean() {
        return aBoolean;
    }

    public void setaBoolean(boolean aBoolean) {
        this.aBoolean = aBoolean;
    }

    public String getIdentity() {
        return identity;
    }

    public void setIdentity(String identity) {
        this.identity = identity;
    }

    public String getFinalTime() {
        return finalTime;
    }

    public void setFinalTime(String finalTime) {
        this.finalTime = finalTime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPicPath() {
        return picPath;
    }

    public void setPicPath(String picPath) {
        this.picPath = picPath;
    }

    public String getContactWay() {
        return contactWay;
    }

    public void setContactWay(String contactWay) {
        this.contactWay = contactWay;
    }

    public String getPlace() {
        return place;
    }

    public void setPlace(String place) {
        this.place = place;
    }

    public String getInfomation() {
        return infomation;
    }

    public void setInfomation(String infomation) {
        this.infomation = infomation;
    }
}
