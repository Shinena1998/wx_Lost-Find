package com.example.lostandfind.service;

import com.example.lostandfind.Repository.InfoRepository;
import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Service
public class SchedulerService {

    @Autowired
    InfoRepository infoRepository;
    private final String IMGFOLDER = "/Users/zhangcong/WeChatApp/pages/img";
    private final String PATHPREFIX = "/pages/img";

    /**
     * 一个事件会在一个月内自动过期。
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkInfo(){
        List<InfoMysql> infoMysqlList = infoRepository.findAll();
        infoMysqlList.size();
        long timestamps = (new Date().getTime())/1000;
        for (int i = 0; i < infoMysqlList.size(); i++) {
            if (timestamps - infoMysqlList.get(i).getTimestamps() > 60 * 60 * 24 * 30) {
                infoMysqlList.get(i).setTimeOut(true);
                infoRepository.save(infoMysqlList.get(i));
            }
        }
    }
    /**
     * 用户上传图片成功但写入信息失败时，此方法用于删除没有对应信息的图片
     * 每天0点核对一次
     */
//    @Scheduled(cron = "0 0 0 * * ?")
//    public void checkImg(){
//        File file = new File(IMGFOLDER);
//        File[] files = file.listFiles();
//        String[] imgPaths = new String[files.length];
//        for (int i = 0; i < files.length; i++) {
//            imgPaths[i] = PATHPREFIX + files[i].getName();
//        }
//        List<InfoMysql> infoMysqlList = infoRepository.findAll();
//        List<String> infoImg = new LinkedList<String>();
//        for (int i = 0; i < infoMysqlList.size(); i++) {
//            infoImg.add(infoMysqlList.get(i).getPicPath());
//        }
//        for (int i = 0; i < imgPaths.length; i++) {
//            if(!infoImg.contains(imgPaths[i])){
//                files[i].delete();
//            }
//        }
//    }

}