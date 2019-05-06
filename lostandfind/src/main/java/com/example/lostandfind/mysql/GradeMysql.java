package com.example.lostandfind.mysql;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class GradeMysql {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int rInfoAddGrade;
    private int rInfoReduceGrade;
    private int rCommentAddGrade;
    private int rCommentReduceGrade;
    private int pushInfoGrade;
    private int remindInfoGrade;
    private int finishInfoGrade;

    public int getrInfoAddGrade() {
        return rInfoAddGrade;
    }

    public void setrInfoAddGrade(int rInfoAddGrade) {
        this.rInfoAddGrade = rInfoAddGrade;
    }

    public int getrInfoReduceGrade() {
        return rInfoReduceGrade;
    }

    public void setrInfoReduceGrade(int rInfoReduceGrade) {
        this.rInfoReduceGrade = rInfoReduceGrade;
    }

    public int getrCommentAddGrade() {
        return rCommentAddGrade;
    }

    public void setrCommentAddGrade(int rCommentAddGrade) {
        this.rCommentAddGrade = rCommentAddGrade;
    }

    public int getrCommentReduceGrade() {
        return rCommentReduceGrade;
    }

    public void setrCommentReduceGrade(int rCommentReduceGrade) {
        this.rCommentReduceGrade = rCommentReduceGrade;
    }

    public int getPushInfoGrade() {
        return pushInfoGrade;
    }

    public void setPushInfoGrade(int pushInfoGrade) {
        this.pushInfoGrade = pushInfoGrade;
    }

    public int getRemindInfoGrade() {
        return remindInfoGrade;
    }

    public void setRemindInfoGrade(int remindInfoGrade) {
        this.remindInfoGrade = remindInfoGrade;
    }

    public int getFinishInfoGrade() {
        return finishInfoGrade;
    }

    public void setFinishInfoGrade(int finishInfoGrade) {
        this.finishInfoGrade = finishInfoGrade;
    }
}
