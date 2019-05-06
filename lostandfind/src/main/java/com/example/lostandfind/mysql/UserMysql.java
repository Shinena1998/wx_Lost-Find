package com.example.lostandfind.mysql;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.stereotype.Repository;

import javax.persistence.*;
import java.util.List;

@Data
@Repository

@Entity(name="user")
@JsonIgnoreProperties(value={"hibernateLazyInitializer","handler","fieldHandler"})
public class UserMysql{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer num;
    public Integer getNum() {
        return num;
    }
    public void setNum(Integer num) {
        this.num = num;
    }

    private String nickName;

    private String avatarUrl;

    private String country;

    private String gender;

    private String language;

    private String openId;

    private String province;

    private String city;

    private String unionId = null;

    private String formId;

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    @JsonIgnore
    @OneToMany(mappedBy = "user",cascade = {CascadeType.ALL},fetch = FetchType.LAZY)
    private List<CommentMysql> commentList;

    @JsonIgnore
    @OneToMany(mappedBy = "user",cascade = {CascadeType.ALL},fetch = FetchType.LAZY)
    private List<InfoMysql> infoMysqlList;

    @JsonIgnore
    @ManyToMany(mappedBy = "userMysqls",fetch = FetchType.LAZY)
    private List<ReportInfoMysql> reportInfoMysqls;

    @JsonIgnore
    @ManyToMany(mappedBy = "users",fetch = FetchType.LAZY)
    private List<ReportCommentMysql> reportCommentMysqls;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name="user_info",joinColumns = @JoinColumn(name="user_num"),
            inverseJoinColumns = @JoinColumn(name="info_mysql_id"))
    private List<InfoMysql> infos;

    public List<InfoMysql> getInfos() {
        return infos;
    }

    public void setInfos(List<InfoMysql> infos) {
        this.infos = infos;
    }

    public List<ReportCommentMysql> getReportCommentMysqls() {
        return reportCommentMysqls;
    }

    public void setReportCommentMysqls(List<ReportCommentMysql> reportCommentMysqls) {
        this.reportCommentMysqls = reportCommentMysqls;
    }

    public List<ReportInfoMysql> getReportInfoMysqls() {
        return reportInfoMysqls;
    }

    public void setReportInfoMysqls(List<ReportInfoMysql> reportInfoMysqls) {
        this.reportInfoMysqls = reportInfoMysqls;
    }

    public List<CommentMysql> getCommentList() {
        return commentList;
    }

    public List<InfoMysql> getInfoMysqlList() {
        return infoMysqlList;
    }
    public void setInfoMysqlList(List<InfoMysql> infoMysqlList) {
        this.infoMysqlList = infoMysqlList;
    }

    public void setCommentList(List<CommentMysql> commentList) {
        this.commentList = commentList;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

}
