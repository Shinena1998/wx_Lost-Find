package com.example.lostandfind.worker;

import com.example.lostandfind.repository.SystemInformRepository;

public class CommentThread {
    private String title;
    private String content;
    private int type;
    private String reported;
    private String reason;
    private int informer;
    private SystemInformRepository sir;
    private String time;
    private Channel channel;


    public CommentThread(String title , String content , int type ,
                          String reported , String reason , int informer,
                          SystemInformRepository sir,String time ,Channel channel){
        this.title  = title;
        this.content = content;
        this.type = type;
        this.informer = informer;
        this.reason = reason;
        this.reported = reported;
        this.sir = sir;
        this.time = time;
        this.channel = channel;
    }
    public void putRequest(){
        IllegalComment ic = new IllegalComment(title,content,type,reported,reason,informer,sir,time);
        channel.putRequest(ic);
    }
}
