package com.example.lostandfind.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.SystemInformMysql;
import com.example.lostandfind.repository.SystemInformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class SystemInfomService {
    @Autowired
    private SystemInformRepository systemInformRepository;

    @Transactional
    public int hasLookInfo(String mark){
        List<Integer> ids = JSON.parseArray(mark,Integer.class);
        System.out.println(ids);
        return systemInformRepository.markRead(ids);
    }
    //id没用
    public List<SystemInformMysql> getSystemInfo(int id,String reported){
        List<SystemInformMysql> infos = systemInformRepository.findByReportedOrderByIdDesc(reported);
        for (int i = 0; i < infos.size(); i++) {
            String content = "";
            if(infos.get(i).getType() == 3){
                content = "您好，您发布的评论\""+infos.get(i).getContent()+"\"已被举报并移除，理由：\""+infos.get(i).getReason()
                        + "\"。请自觉遵守国家相关法律法规以及社区规则，西理工失物招领良好的社区氛围需要大家一起维护！";
            }else if(infos.get(i).getType() == 2){
                content = "您好，您发布的信息\""+infos.get(i).getContent()+"\"已被举报并移除，理由：\""+infos.get(i).getReason()
                        + "\"。请自觉遵守国家相关法律法规以及社区规则，西理工失物招领良好的社区氛围需要大家一起维护！";
            }else if (infos.get(i).getType() == 1){
                String remark = null;
                if("审核通过".equals(infos.get(i).getReason())){
                    remark = "此失物信息将会在对应分区置顶显示3天，感谢您的使用~";
                }else{
                    remark = "此失物信息将会降级为普通信息，感谢您的使用~";
                }
                content = "您好，您发布的贵重失物信息\""+infos.get(i).getContent()+"\"已被管理员审核，结果：\""+infos.get(i).getReason()
                        + "\"。" + remark;
            }
            infos.get(i).setContent(content);
        }
        return infos;
    }

}
