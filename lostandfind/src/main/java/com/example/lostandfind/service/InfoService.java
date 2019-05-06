package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.lucene.CreateIndex;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.NewsMysql;
import com.example.lostandfind.repository.*;
import com.example.lostandfind.utils.ResultUtil;
import com.example.lostandfind.worker.Channel;
import com.example.lostandfind.worker.ClientThread;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class InfoService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private StringRedisTemplate template;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Template templateService;

    @Autowired
    private InfoRepository infoRepository;

    @Autowired
    private FinishRespository finishRespository;

    @Autowired
    private  PushRepository pushRepository;
    @Autowired
    private PersonInfoRespository personInfoRespository;
    @Autowired
    private CreateIndex createIndex;
    public boolean hasError(InfoMysql infoMysql){
        if(infoMysql.isaBoolean() == false){
            if(infoMysql.getTime()== "" || infoMysql.getCategory() == ""
                    || infoMysql.getInfomation() == ""
                    || infoMysql.getPicPath() == "" || infoMysql.getPlace()== ""){
                return true;
            }else {
                return false;
            }
        }else {
            if(infoMysql.getTime()== "" || infoMysql.getCategory() == ""
                    || infoMysql.getInfomation() == ""
                    || infoMysql.getPicPath() == "" || infoMysql.getPlace()== ""
                    || infoMysql.getIdentity() == ""){
                return true;
            }else {
                return false;
            }
        }
    }

    //按照页数取出一般信息
    @Transactional
    public List<InfoMysql> pageInfo(int pageNum){
        int size = 200;
        int page = pageNum;
        Sort sort = new Sort(Sort.Direction.ASC,"id");
        Pageable pageable = PageRequest.of(page,size,sort);
        return infoRepository.findByIsValuableOrABooleanOrderByIdDesc(false,false,pageable);
    }
    //上传物品信息
    @Transactional
    public Result writeInfo(InfoMysql infoMysql, String name, Channel channel) throws ParseException {
        if (infoMysql.isValuable()){
            templateService.getManager(1);
        }
        if (hasError(infoMysql)) {
            return ResultUtil.error(12, "填全内容");
        }
        infoMysql.setCount(0);
        infoMysql.setTimestamps((new Date().getTime())/1000);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        infoMysql.setLoststamp(simpleDateFormat.parse(infoMysql.getTime()).getTime()/1000 + 1000);
        infoRepository.save(infoMysql);
        List<InfoMysql> infos = new ArrayList<InfoMysql>();
        infos.add(infoMysql);
        createIndex.CreateIndex(infos);
        if(!name.equals("无")){
            new ClientThread(personInfoRespository,pushRepository,name,infoMysql,channel).putRequest();
        }
        return ResultUtil.success(infoMysql);
    }
    //管理员审核物品
    @Transactional
    public Result passValuable(int id, boolean confirm){
        InfoMysql infoMysql =  infoRepository.findById(id).get();
        Template template = templateService;
        String result;
        if(confirm){
            infoMysql.setaBoolean(confirm);
            result = "审核通过";
        }else{
            infoMysql.setValuable(confirm);
            result = "审核不通过";
        }
        String formId = templateService.getFormId(infoMysql);
        if(!formId.equals("none")){
            templateService.reviewResult(infoMysql.getTheme(),result,infoMysql.getUser().getOpenId(),formId);
        }
        infoRepository.save(infoMysql);
        return ResultUtil.success();
    }

    public int addCount(int id){
        InfoMysql infoMysql = infoRepository.findById(id).get();
        int count = infoMysql.getCount();
        infoMysql.setCount(++count);
        infoRepository.save(infoMysql);
        return count;
    }

    public boolean deleteInfo(int id){
        InfoMysql infoMysql = infoRepository.findById(id).get();
        infoRepository.delete(infoMysql);
        return true;
    }

    public JSONObject infoCount(String openid){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("info",infoRepository.infoCount(openid));
        jsonObject.put("finish",finishRespository.finishCount(openid));
        return jsonObject;
    }

    public Object uploadPicS(MultipartFile file,int height,int width,String category,String openid) throws Exception{
        if(file.isEmpty()==true){
            return "error";
        }else {
            String imgType = file.getOriginalFilename().split("\\.")[file.getOriginalFilename().split("\\.").length-1];
            String imgName = "+" + height + "+" + width + "+" + new Date().getTime() + openid +'.'+imgType;
            byte[] bytes = file.getBytes();
            Path path = Paths.get("/root/html/img/"+ imgName);
            Files.write(path,bytes);
            JSONObject jsonObject1 = new JSONObject();
            jsonObject1.put("imgPath","https://yuigahama.xyz/img/"+imgName);

            if(category.equals("证件")){
                HttpEntity<MultiValueMap<String, String>> r = new Template().getOcrInfo(imgName);
                System.out.println("access_token:"+template.opsForValue().get("OcrToken"));
                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token="+template.opsForValue().get("OcrToken");
//                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.84aa7d8c9edccf297cc361f731e4cd99.2592000.1555730017.282335-14936363";
                JSONObject jsonObject = restTemplate.postForObject(url, r, JSONObject.class);
                jsonObject1.put("imgInfo",new Template().processCroInfo(jsonObject));
            }else{
                jsonObject1.put("imgInfo","无");
            }
            return jsonObject1;
        }
    }
    public Object uploadPic(MultipartFile file,int height,int width,String category,String openid) throws Exception{
        if(file.isEmpty()==true){
            return "error";
        }else {
            String imgType = file.getOriginalFilename().split("\\.")[file.getOriginalFilename().split("\\.").length - 1];
            String imgName = "+" + height + "+" + width + "+" + new Date().getTime() + openid + '.' + imgType;
            byte[] bytes = file.getBytes();
            Path path = Paths.get("/Users/zhangcong/WeChatProjects/miniprogram-test-1/pages/img/" + imgName);
            Files.write(path, bytes);
            JSONObject jsonObject1 = new JSONObject();
            jsonObject1.put("imgPath", "/pages/img/" + imgName);
            if (category.equals("证件")) {
                HttpEntity<MultiValueMap<String, String>> r = new Template().getOcrInfo(imgName);
                System.out.println("access_token:" + template.opsForValue().get("OcrToken"));
                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.b556ba6ef395c39b57f5eb5559830823.2592000.1555680730.282335-14936363";

//                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.d9cb44b1e4768a4e068fafb052cf7c18.2592000.155013asdas3314.282335-14936363";
                JSONObject jsonObject = restTemplate.postForObject(url, r, JSONObject.class);
                jsonObject1.put("imgInfo", new Template().processCroInfo(jsonObject));
                System.out.println(jsonObject1);
            } else {
                jsonObject1.put("imgInfo", "无");
            }
            return jsonObject1;
        }
    }
    public NewsMysql writeNews(MultipartFile file,int height,int width,
                               String category,String openid,String time,String name,String img) throws  Exception{
        String path = ((JSONObject)this.uploadPicS(file,height,width,category,openid)).getString("imgPath");
        NewsMysql newsMysql = new NewsMysql(name,openid,time,path,img);
        return newsRepository.save(newsMysql);
    }
}
