package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.repository.FinishRespository;
import com.example.lostandfind.repository.InfoRepository;
import com.example.lostandfind.mysql.FinishMysql;
import com.example.lostandfind.mysql.InfoMysql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.*;

@Service
public class SchedulerService {

    @Autowired
    private RedisTemplate<String, InfoMysql> redisTemplate;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private InfoRepository infoRepository;
    @Autowired
    private FinishRespository finishRespository;
    @Autowired
    private RestTemplate restTemplate;
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
    /**
     * 防止redis内存与数据库数据不一致，每天2点更新数据
     * 每天2点核对一次
     * infoN 普通物品
     * infoV 贵重物品
     */
    @Scheduled(fixedDelay = 86400000)
    public void checkRedis(){
        List<InfoMysql> info = infoRepository.getinfo();
        List<InfoMysql> infoValuable = infoRepository.getValuableinfo();
        if(info.size() > 0) {
            if (redisTemplate.hasKey("infoN")) {
                redisTemplate.delete("infoN");
                redisTemplate.opsForList().rightPushAll("infoN", info);
            } else {
                redisTemplate.opsForList().rightPushAll("infoN", info);
            }
        }
        if(infoValuable.size() > 0) {
            if (redisTemplate.hasKey("infoV")) {
                redisTemplate.delete("infoV");
                redisTemplate.opsForList().rightPushAll("infoV", infoValuable);
            } else {
                redisTemplate.opsForList().rightPushAll("infoV", infoValuable);
            }
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

//    @Scheduled(fixedDelay = 5000)
//    public void getOcrInfo(){
//        String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.c8c8e6c23cb2679481561bd21226164a.2592000.1545727601.282335-14936363";
//        byte[] data = null;
//        InputStream in = null;
//        try{
////            in = new FileInputStream(imgUrl+imgName);
//            in = new FileInputStream("/Users/zhangcong/Downloads/234.jpg");
//            data = new byte[in.available()];
//            in.read(data);
//            in.close();
//        }catch (Exception e){
//        }
//        String image = Base64.encode(data);
//        System.out.println(image);
//        MultiValueMap<String, String> postParameters = new LinkedMultiValueMap<>();
//        HttpHeaders headers = new HttpHeaders();
//        postParameters.add("image",image);
//        headers.add("Content-Type", "application/x-www-form-urlencoded");
//        HttpEntity<MultiValueMap<String, String>> r = new HttpEntity<>(postParameters, headers);
//        JSONObject jsonObject = restTemplate.postForObject(url, r, JSONObject.class);
//        System.out.println(jsonObject);
//        JSONArray jsonArray = jsonObject.getJSONArray("words_result");
//        StringBuffer sb = new StringBuffer();
//        for (int i = 0; i < jsonArray.size(); i++) {
//
//            sb.append(((JSONObject)jsonArray.get(i)).getString("words"));
//        }
//        System.out.println(sb.toString());
//    }
}
