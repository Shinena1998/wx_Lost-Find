package com.example.lostandfind.service;

import com.example.lostandfind.Repository.FinishRespository;
import com.example.lostandfind.Repository.InfoRepository;
import com.example.lostandfind.mysql.FinishMysql;
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
    private InfoRepository infoRepository;
    @Autowired
    private FinishRespository finishRespository;
    private final String IMGFOLDER = "/root/html/img/";//服务器图片存储绝对路径
    private final String PATHPREFIX = "https://yuigahama.xyz/img/";//数据库存储图片域名路径，

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
                infoRepository.delete(infoMysqlList.get(i));
                FinishMysql finishMysql = new FinishMysql();
                finishMysql.setCategory(infoMysqlList.get(i).getCategory());
                finishMysql.setContactWay(infoMysqlList.get(i).getContactWay());
                finishMysql.setIdentity(infoMysqlList.get(i).getIdentity());
                finishMysql.setInfomation(infoMysqlList.get(i).getInfomation());
                finishMysql.setKind(infoMysqlList.get(i).getKind());
                finishMysql.setPicPath(infoMysqlList.get(i).getPicPath());
                finishMysql.setTheme(infoMysqlList.get(i).getTheme());
                finishMysql.setTime(infoMysqlList.get(i).getTime());
                finishMysql.setPlace(infoMysqlList.get(i).getPlace());
                finishMysql.setCurrent(infoMysqlList.get(i).getCurrent());
                finishMysql.setTimeOut(true);
                finishRespository.save(finishMysql);
            }
        }
    }
    /**
     * 贵重物品会存在三天时间，三天之后被降级为一般物品
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkValuable(){
        List<InfoMysql> infoMysqlList = infoRepository.findByABooleanAndIsValuableOrderByTimestampsDesc(true,false);
        infoMysqlList.size();
        long timestamps = (new Date().getTime())/1000;
        for (int i = 0; i < infoMysqlList.size(); i++) {
            if (timestamps - infoMysqlList.get(i).getTimestamps() > 60 * 60 * 24 * 3) {
                infoMysqlList.get(i).setaBoolean(false);
                infoRepository.save(infoMysqlList.get(i));
            }
        }
    }
    /**
     * 用户上传图片成功但写入信息失败时，此方法用于删除没有对应信息的图片
     * 每天0点核对一次
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkImg(){
        File file = new File(IMGFOLDER);
        File[] files = file.listFiles();
        String[] imgPaths = new String[files.length];
        /**
         * 把图片名改为和数据库存储格式一致
         */
        for (int i = 0; i < files.length; i++) {
            imgPaths[i] = PATHPREFIX + files[i].getName();
        }
        /**
         * 结束与未结束的图片在一个文件夹存储
         */
        List<InfoMysql> infoMysqlList = infoRepository.findAll();
        List<FinishMysql> finishMysqlList = finishRespository.findAll();
        List<String> infoImg = new LinkedList<String>();
        for (int i = 0; i < infoMysqlList.size(); i++) {
            infoImg.add(infoMysqlList.get(i).getPicPath());
        }
        for (int i = 0; i < finishMysqlList.size(); i++) {
            infoImg.add(finishMysqlList.get(i).getPicPath());
        }
        for (int i = 0; i < imgPaths.length; i++) {
            /**
             * 如果某一图片既不在结束集合，也不是未结束集合内，说明此图片没有相关信息，故删除
             */
            if(!infoImg.contains(imgPaths[i])){
                files[i].delete();
            }
        }
    }

}
