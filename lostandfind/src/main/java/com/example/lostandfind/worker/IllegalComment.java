package com.example.lostandfind.worker;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.SystemInformMysql;
import com.example.lostandfind.repository.SystemInformRepository;

import java.util.ArrayList;
import java.util.List;

public class IllegalComment {
    private String title;
    private String content;
    private int type;
    private String reported;
    private String reason;
    private int informer;
    private String time;
    private SystemInformRepository sir;

    public IllegalComment(String title , String content , int type ,
                          String reported , String reason , int informer,
                          SystemInformRepository sir,String time){
        this.title  = title;
        this.content = content;
        this.type = type;
        this.informer = informer;
        this.reason = reason;
        this.reported = reported;
        this.sir = sir;
        this.time = time;
    }
    public synchronized void execute(){
        System.out.println("将违规数据写入通知");
        List<JSONObject> informers = new ArrayList<>();
        if(type == 3){
            informers = sir.selectCommentInformer(informer);
        }else if(type == 2){
            informers = sir.selectInfoInformer(informer);
        }
        SystemInformMysql sim = new SystemInformMysql();
        sim.setTitle(title);
        sim.setType(type);
        sim.setContent(content);
        sim.setReason(reason);
        sim.setReported(reported);
        sim.setLook(false);
        sim.setTime(time);
        for (int i = 0; i < informers.size(); i++) {
            sim.setInformer(informers.get(i).getInteger("user_id"));
            sir.save(sim);
        }
    }
}
