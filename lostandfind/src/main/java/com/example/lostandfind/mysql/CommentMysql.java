package com.example.lostandfind.mysql;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.stereotype.Repository;

import javax.persistence.*;

@Entity
@Repository
@JsonIgnoreProperties(value={"hibernateLazyInitializer","handler","fieldHandler"})
@NamedEntityGraph(name="comment.all",attributeNodes={@NamedAttributeNode("user"),@NamedAttributeNode("info")})
public class CommentMysql {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String content;
    private String time;
    private String uid;
    private String toUid;
    private String toName;
    private boolean view;
    private boolean toView;
    private String identity;

    @JsonIgnore
    @ManyToOne(cascade = {CascadeType.MERGE},fetch = FetchType.LAZY)
    @JoinColumn(name="user_num")
    private UserMysql user;

    @JsonIgnore
    @ManyToOne(cascade = {CascadeType.MERGE},fetch = FetchType.LAZY)
    @JoinColumn(name="info_id")
    private InfoMysql info;

    public String getIdentity() {
        return identity;
    }

    public void setIdentity(String identity) {
        this.identity = identity;
    }

    public InfoMysql getInfo() {
        return info;
    }

    public void setInfo(InfoMysql info) {
        this.info = info;
    }

    public UserMysql getUser() {
        return user;
    }

    public void setUser(UserMysql user) {
        this.user = user;
    }

    public boolean isView() {
        return view;
    }

    public void setView(boolean view) {
        this.view = view;
    }

    public boolean isToView() {
        return toView;
    }

    public void setToView(boolean toView) {
        this.toView = toView;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getToUid() {
        return toUid;
    }

    public void setToUid(String toUid) {
        this.toUid = toUid;
    }

    public String getToName() {
        return toName;
    }

    public void setToName(String toName) {
        this.toName = toName;
    }
}
