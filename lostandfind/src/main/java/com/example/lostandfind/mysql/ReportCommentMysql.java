package com.example.lostandfind.mysql;

import org.springframework.stereotype.Repository;

import javax.persistence.*;
import java.util.List;
@Entity(name = "reportcomment")
@Repository
public class ReportCommentMysql {
    @Id
    private int reportId;

    @Column(columnDefinition = "tinyint")
    private boolean process;//管理员是否处理举报

    private int count;//该信息被举报次数；

    private int operator; //那位管理员操作

    private String reason;//举报理由

    //评论要user是因为要级联用户信息，而头像不用是因为从reportId中拿去失物信息，然后从失物信息查找失主
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private UserMysql user;//发布信息的用户

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="comment_user",joinColumns = @JoinColumn(name="reportcomment_report_id"),
            inverseJoinColumns = @JoinColumn(name="user_id"))
    private List<UserMysql> users ;//举报人

    public int getReportId() {
        return reportId;
    }

    public void setReportId(int reportId) {
        this.reportId = reportId;
    }

    public boolean isProcess() {
        return process;
    }

    public void setProcess(boolean process) {
        this.process = process;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getOperator() {
        return operator;
    }

    public void setOperator(int operator) {
        this.operator = operator;
    }

    public UserMysql getUser() {
        return user;
    }

    public void setUser(UserMysql user) {
        this.user = user;
    }

    public List<UserMysql> getUsers() {
        return users;
    }

    public void setUsers(List<UserMysql> users) {
        this.users = users;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
