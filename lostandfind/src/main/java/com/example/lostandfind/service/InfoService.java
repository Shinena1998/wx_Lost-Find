package com.example.lostandfind.service;

import com.example.lostandfind.mysql.InfoMysql;

public class InfoService {
    public boolean hasError(InfoMysql infoMysql){
        if(infoMysql.isaBoolean() == false){
            if(infoMysql.getTime()== "" || infoMysql.getCategory() == ""
                    || infoMysql.getInfomation() == ""
                    || infoMysql.getPicPath() == "" || infoMysql.getPlace()== ""
                    || infoMysql.getQuestion() == "" || infoMysql.getAnwer() == ""){
                return true;
            }else {
                return false;
            }
        }else {
            if(infoMysql.getTime()== "" || infoMysql.getCategory() == ""
                    || infoMysql.getInfomation() == ""
                    || infoMysql.getPicPath() == "" || infoMysql.getPlace()== ""
                    || infoMysql.getIdentity() == ""){
                return true;
            }else {
                return false;
            }
        }
    }
}
