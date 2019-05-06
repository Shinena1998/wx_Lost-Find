package com.example.lostandfind.worker;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.PersonInfoRespository;
import com.example.lostandfind.repository.PushRepository;

import java.util.Random;

public class ClientThread{
    private PushRepository pushRepository;
    private PersonInfoRespository personInfoRespository;
    private String name;
    private InfoMysql infoMysql;
    private Channel channel;


    public ClientThread(PersonInfoRespository personInfoRespository, PushRepository pushRepository, String name, InfoMysql infoMysql,Channel channel){
        this.personInfoRespository = personInfoRespository;
        this.pushRepository = pushRepository;
        this.name = name;
        this.infoMysql = infoMysql;
        this.channel = channel;
    }

    public void putRequest(){
        Request request = new Request(personInfoRespository,pushRepository,name,infoMysql);
        channel.putRequest(request);
    }
}
