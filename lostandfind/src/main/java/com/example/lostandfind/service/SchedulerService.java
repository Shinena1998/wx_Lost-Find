package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.ManagerMysql;
import com.example.lostandfind.repository.FinishRespository;
import com.example.lostandfind.repository.InfoRepository;
import com.example.lostandfind.mysql.FinishMysql;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.ManageRepository;
import com.example.lostandfind.utils.DivideWord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SchedulerService {

    @Autowired
    private InfoRepository infoRepository;
    @Autowired
    private FinishRespository finishRespository;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private ManageRepository manageRepository;
    private final String IMGFOLDER = "/root/html/img/";//服务器图片存储绝对路径
    private final String PATHPREFIX = "https://yuigahama.xyz/img/";//数据库存储图片域名路径，

    /**
     * 1 ,2 ,3按顺序执行
     * 一个事件会在一个月内自动过期。
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkInfo(){
        List<InfoMysql> infoMysqlList = infoRepository.findAll();
        infoMysqlList.size();
        long timestamps = (new Date().getTime())/1000;
        for (int i = 0; i < infoMysqlList.size(); i++) {
            if (timestamps - infoMysqlList.get(i).getTimestamps() > 60 * 60 * 24 * 30) {
                this.saveFinishInfo(infoMysqlList.get(i),true);
            }else if(timestamps - infoMysqlList.get(i).getTimestamps() > 60 * 60 * 24 * 7 && infoMysqlList.get(i).isConfirm()){
                this.saveFinishInfo(infoMysqlList.get(i),false);
            }
        }
    }
    //向已完成信息保存
    public void saveFinishInfo(InfoMysql infoMysql,boolean isTimeout){
        infoRepository.delete(infoMysql);
        FinishMysql finishMysql = new FinishMysql();
        finishMysql.setCategory(infoMysql.getCategory());
        finishMysql.setContactWay(infoMysql.getContactWay());
        finishMysql.setIdentity(infoMysql.getIdentity());
        finishMysql.setInfomation(infoMysql.getInfomation());
        finishMysql.setKind(infoMysql.getKind());
        finishMysql.setPicPath(infoMysql.getPicPath());
        finishMysql.setTheme(infoMysql.getTheme());
        finishMysql.setTime(infoMysql.getTime());//物品丢失
        finishMysql.setPush(infoMysql.getCurrent());//信息发布
        finishMysql.setPlace(infoMysql.getPlace());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        finishMysql.setCurrent(sdf.format(new Date()));
        finishMysql.setTimeOut(isTimeout);
        finishRespository.save(finishMysql);
    }
    /**
     * 贵重物品会存在三天时间，三天之后被降级为一般物品
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void checkValuable(){
        List<InfoMysql> infoMysqlList = infoRepository.findByABooleanAndIsValuableOrderByTimestampsDesc(true,false);
        infoMysqlList.size();
        long timestamps = (new Date().getTime())/1000;
        for (int i = 0; i < infoMysqlList.size(); i++) {
            if (timestamps - infoMysqlList.get(i).getTimestamps() > 60 * 60 * 24 * 3) {
                infoMysqlList.get(i).setValuable(false);
                infoRepository.save(infoMysqlList.get(i));
            }
        }
    }
    /**
     * 用户上传图片成功但写入信息失败时，此方法用于删除没有对应信息的图片
g     */
    @Scheduled(cron = "0 0 1 * * ?")
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

    @Autowired
    private DivideWord divideWord;
    @Scheduled(cron = "0 0 4 * * ?")
    public void search(){
        if(stringRedisTemplate.hasKey("infos")){
            List<String> list = stringRedisTemplate.opsForList().range("infos",0,-1);
            for (int i = 0; i < list.size(); i++) {
                divideWord.divideWord(list.get(i));
            }
            //获取分数值从大到小的前10位值
            Set index = stringRedisTemplate.opsForZSet().reverseRange("search",0,10);

            //更新排名内容
            divideWord.updateIndex(index);
            stringRedisTemplate.delete("infos");

        }
    }
    /**
     * 获取ocr access_token
     */
//    @Scheduled(fixedDelay = 864000000)
//    public void updataOcrToken(){
//        String url="https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=5wS49QStKVHBDLMRQSkGhH5b&client_secret=4oAk4IImFiDd40oOILew0GWMAfG83CM9";
//        JSONObject jsonObject = restTemplate.postForEntity(url,null, JSONObject.class).getBody();
//        System.out.println(jsonObject);
//        if(stringRedisTemplate.hasKey("OcrToken")){
//            stringRedisTemplate.delete("OcrToken");
//            stringRedisTemplate.opsForValue().set("OcrToken",jsonObject.getString("access_token"));
//        }else {
//            stringRedisTemplate.opsForValue().set("OcrToken",jsonObject.getString("access_token"));
//        }
//    }

    @Autowired
    private Template templateService;
    //通知管理员审核信息
    @Scheduled(fixedDelay = 1800000)
    public void informMagager(){
        templateService.pushInfo();
        templateService.pushReport();
    }

}
