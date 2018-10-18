package com.example.lostandfind.mysql;

import lombok.Data;
import org.springframework.stereotype.Component;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
@Component
public class HistoryMysql {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String openid;

    /**
     * 用于接收前端数据
     */
    private String[] historyList;

    /**
     * 用于记录用户查询类型
     */
    private String picker;

    private String[] indexList;

    private String eye;
    /**
     * 用来往数据库存数据
     */
    private String history;

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

    public String[] getHistoryList() {
        return historyList;
    }

    public void setHistoryList(String[] historyList) {
        this.historyList = historyList;
    }

    public String getPicker() {
        return picker;
    }

    public void setPicker(String picker) {
        this.picker = picker;
    }

    public String getEye() {
        return eye;
    }

    public void setEye(String eye) {
        this.eye = eye;
    }

    public String[] getIndexList() {
        return indexList;
    }

    public void setIndexList(String[] indexList) {
        this.indexList = indexList;
    }

    public String getHistory() {
        return history;
    }

    public void setHistory(String history) {
        this.history = history;
    }
}
