package com.example.lostandfind.worker;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.PersonInfoMysql;
import com.example.lostandfind.mysql.PushMysql;
import com.example.lostandfind.repository.PersonInfoRespository;
import com.example.lostandfind.repository.PushRepository;

import java.util.List;

public class Request {
    private PushRepository pushRepository;
    private PersonInfoRespository personInfoRespository;
    private String name;
    private InfoMysql infoMysql;


    public Request(PersonInfoRespository personInfoRespository, PushRepository pushRepository, String name, InfoMysql infoMysql){
        this.personInfoRespository = personInfoRespository;
        this.pushRepository = pushRepository;
        this.name = name;
        this.infoMysql = infoMysql;
    }

    public synchronized void execute(){
        List<PersonInfoMysql> personInfos = personInfoRespository.findByName(name);
        if(personInfos != null){
            System.out.println("找到了失主信息");
            for (int i = 0; i < personInfos.size(); i++) {
                System.out.println("开始填写失主信息");
                PushMysql pushMysql = new PushMysql();
                pushMysql.setLook(false);
                pushMysql.setInfo(infoMysql);
                pushMysql.setName(name);
                pushRepository.save(pushMysql);
            }
        }

    }
}
