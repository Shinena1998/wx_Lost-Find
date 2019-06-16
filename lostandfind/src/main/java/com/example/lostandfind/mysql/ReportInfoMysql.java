package com.example.lostandfind.mysql;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import javax.persistence.*;
import java.util.List;

@Entity(name = "reportinfo")
@Repository
@NamedEntityGraph(name="report.all",attributeNodes={@NamedAttributeNode("userMysqls")})
public class ReportInfoMysql {
    @Id
    private int reportId;//被信息id；

    @Column(columnDefinition = "tinyint")
    private boolean process;//管理员是否处理举报

    /**
     * 因为举报信息如果为失物信息，reportId查找info是会自动关联查出user。
     * 评论要user是因为要级联用户信息，而失物不用是因为从reportId中拿去失物信息，然后从失物信息查找失主
     */

//    @OneToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "user_id")
//    private UserMysql user;//发布信息的用户

    private int count;//该信息被举报次数；

    private int operator; //那位管理员操作

    private String reason;//举报理由

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="report_user",joinColumns = @JoinColumn(name="report_report_id"),
    inverseJoinColumns = @JoinColumn(name="user_id"))
    private List<UserMysql> userMysqls ;//举报人


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

    public List<UserMysql> getUserMysqls() {
        return userMysqls;
    }

    public void setUserMysqls(List<UserMysql> userMysqls) {
        this.userMysqls = userMysqls;
    }

    public int getOperator() {
        return operator;
    }

    public void setOperator(int operator) {
        this.operator = operator;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

}
