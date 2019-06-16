package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.lucene.CreateIndex;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.NewsMysql;
import com.example.lostandfind.repository.*;
import com.example.lostandfind.utils.DivideWord;
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

    @Autowired
    private DivideWord divideWord;

    @Autowired
    private ManageRepository manageRepository;
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
            //贵重物品则通知管理员
            templateService.getManager(1);
        }
        if (hasError(infoMysql)) {
            return ResultUtil.error(12, "填全内容");
        }
        infoMysql.setCount(0);
        infoMysql.setTimestamps((new Date().getTime())/1000);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        infoMysql.setLoststamp(simpleDateFormat.parse(infoMysql.getTime()).getTime()/1000 + 1000);
        infoMysql.setCurrent(simpleDateFormat.format(new Date()));
        infoRepository.save(infoMysql);
        List<InfoMysql> infos = new ArrayList<InfoMysql>();
        infos.add(infoMysql);
        createIndex.CreateIndex(infos);
        //添加信息，进行搜索排名
        divideWord.addInfo(infoMysql.getTheme()+infoMysql.getInfomation());
        //获取关键词
        infoMysql.setKeyWord(divideWord.getKeyWord(infoMysql.getTheme()+infoMysql.getInfomation()));
        if(!name.equals("无")){
            new ClientThread(personInfoRespository,pushRepository,name,infoMysql,channel).putRequest();
        }
        return ResultUtil.success(infoMysql);
    }
    //更新管理员formId
    @Transactional
    public void updateFormId(String openid,String formId){
        manageRepository.updataFormId(formId,openid);
    }
    //管理员审核物品
    @Transactional
    public Result passValuable(int id, boolean confirm,String form , String openId,int num){
        this.updateFormId(openId,form);//更新管理员formId
        InfoMysql infoMysql =  infoRepository.findById(id).get();
        String result;
        if(confirm){
            infoMysql.setaBoolean(confirm);
            result = "审核通过";
        }else{
            infoMysql.setValuable(confirm);
            result = "审核不通过";
        }
        templateService.reviewResult(infoMysql.getTheme(),result,num,infoMysql.getIdentity());
        infoRepository.save(infoMysql);
        return ResultUtil.success();
    }
    //增加信息查看数
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

    //获得个人发布和完成数量
    public JSONObject infoCount(String openid){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("info",infoRepository.infoCount(openid));
        jsonObject.put("finish",finishRespository.finishCount(openid));
        return jsonObject;
    }

    /**
     * 服务器上传图片
     * @param file
     * @param height
     * @param width
     * @param category
     * @param openid
     * @param pathType 分别需要上传news图片，和信息图片
     * @return
     * @throws Exception
     */
    public Object uploadPicS(MultipartFile file,int height,int width,String category,String openid,String pathType) throws Exception{
        if(file.isEmpty()==true){
            return "error";
        }else {
            String imgType = file.getOriginalFilename().split("\\.")[file.getOriginalFilename().split("\\.").length-1];
            String imgName = "+" + height + "+" + width + "+" + new Date().getTime() + openid +'.'+imgType;
            byte[] bytes = file.getBytes();
            Path path = Paths.get("/root/html/"+ pathType + imgName);
            Files.write(path,bytes);
            JSONObject jsonObject1 = new JSONObject();
            jsonObject1.put("imgPath","https://yuigahama.xyz/"+pathType+imgName);

            if(category.equals("证件") || category.equals("一卡通")){
                HttpEntity<MultiValueMap<String, String>> r = new Template().getOcrInfo(imgName);
                System.out.println("access_token:"+template.opsForValue().get("OcrToken"));
                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token="+template.opsForValue().get("OcrToken");
//                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.84aa7d8c9edccf297cc361f731e4cd99.2592000.1555730017.282335-14936363";
                JSONObject jsonObject = restTemplate.postForObject(url, r, JSONObject.class);
                System.out.println(jsonObject);
                if(category.equals("证件")){
                    jsonObject1.put("imgInfo",new Template().processCroInfo(jsonObject));
                }else {
                    jsonObject1.put("imgInfo",new Template().processAcard(jsonObject));
                }
            }else{
                jsonObject1.put("imgInfo","无");
            }
            return jsonObject1;
        }
    }
    public Object uploadPic(MultipartFile file,int height,int width,String category,String openid,String pathType) throws Exception{
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
            if (category.equals("证件") || category.equals("一卡通")) {
                HttpEntity<MultiValueMap<String, String>> r = new Template().getOcrInfo(imgName);
                System.out.println("access_token:" + template.opsForValue().get("OcrToken"));
                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.dc42a0de56964cbc288cbcd0ea374c80.2592000.1559979756.282335-14936363";

//                String url = "https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=24.d9cb44b1e4768a4e068fafb052cf7c18.2592000.155013asdas3314.282335-14936363";
                JSONObject jsonObject = restTemplate.postForObject(url, r, JSONObject.class);
                System.out.println(jsonObject);
                if(category.equals("证件")){
                    jsonObject1.put("imgInfo",new Template().processCroInfo(jsonObject));
                }else {
                    jsonObject1.put("imgInfo",new Template().processAcard(jsonObject));
                }
            } else {
                jsonObject1.put("imgInfo", "无");
            }
            return jsonObject1;
        }
    }

    //上传周报图片
    public NewsMysql writeNews(MultipartFile file,int height,int width,
                               String category,String openid,String time,String name,String img) throws  Exception{
        String path = ((JSONObject)this.uploadPicS(file,height,width,category,openid,"news/")).getString("imgPath");
        NewsMysql newsMysql = new NewsMysql(name,openid,time,path,img);
        return newsRepository.save(newsMysql);
    }
}
