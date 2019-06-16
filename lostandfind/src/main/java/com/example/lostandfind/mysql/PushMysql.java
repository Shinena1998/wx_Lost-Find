package com.example.lostandfind.mysql;

import javax.persistence.*;

@Entity(name="push")
public class PushMysql {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name="info_mysql_id")
    private InfoMysql pushInfo;


    private String name;

    @Column(columnDefinition = "tinyint")
    private boolean look;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public InfoMysql getPushInfo() {
        return pushInfo;
    }

    public void setPushInfo(InfoMysql pushInfo) {
        this.pushInfo = pushInfo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isLook() {
        return look;
    }

    public void setLook(boolean look) {
        this.look = look;
    }
}
