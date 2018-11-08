package com.example.lostandfind.service;


import com.example.lostandfind.Repository.InfoRepository;
import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

public class TimeSelectService {

    @Autowired
    private InfoRepository infoRepository;

    public List<InfoMysql> timeSelect(String name,List<InfoMysql> infoMysqlList) throws Exception{
        String[] times = name.split("~");
        times[0] = times[0] + " 0:0:0";
        times[1] = times[1] + " 23:59:59";
        String res;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date1 = simpleDateFormat.parse(times[0]);
        long timeStart = date1.getTime()/1000;
        Date date2 = simpleDateFormat.parse(times[1]);
        long timeEnd = date2.getTime()/1000;
        System.out.println("qwe"+timeStart + "~" + timeEnd);
        for (int i = 0; i < infoMysqlList.size(); i++) {
            System.out.print(infoMysqlList.get(i).getLoststamp()+"---");
        }
        System.out.println();
        if(timeStart > timeEnd){
            return null;
        }
        int start = 0;
        int end = 0;
        int i;
        for (i = 0; i < infoMysqlList.size(); i++) {
            if(timeStart <= infoMysqlList.get(i).getLoststamp()) {
                start = i;
                break;
            }
        }
        for (int j = i; j < infoMysqlList.size(); j++) {
            if(timeEnd <= infoMysqlList.get(j).getLoststamp()){
                end = j;
                break;
            }
        }
        System.out.println("asd"+start+"@"+end);
        if(timeEnd >= infoMysqlList.get(infoMysqlList.size()-1).getLoststamp()){
            end = infoMysqlList.size();
        }
        if(timeStart >= infoMysqlList.get(infoMysqlList.size()-1).getLoststamp()){
            return null;
        }
        //**防止某天没有信息，但是start>i;end也是>i,end<i+1,此时end为0，start为i-1
        if(start > end){
            return null;
        }
        System.out.println(start + "+" + end);
        infoMysqlList = infoMysqlList.subList(start,end);
        return infoMysqlList;
    }
}
