package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.LostandfindApplication;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.ManagerMysql;
import com.example.lostandfind.mysql.ThanksMysql;
import com.example.lostandfind.repository.*;
import com.example.lostandfind.restTemplate.RestTemplateConfig;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class Template {
//    final static String imgUrl = "/root/html/img/";
    final static String imgUrl = "/Users/zhangcong/WeChatProjects/miniprogram-test-1/pages/img/";
    private static final Logger logger = LoggerFactory.getLogger(Template.class);


    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ManageRepository manageRepository;

    @Autowired
    private InfoRepository infoRepository;

    @Autowired
    private ReportCommentRepository reportCommentRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ThanksRepository thanksRepository;
    public JSONObject getAccessToken(){
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc";
        return restTemplate.exchange(url, HttpMethod.GET,null,JSONObject.class).getBody();
    }


    //百度ocr识别图片
    public HttpEntity<MultiValueMap<String, String>> getOcrInfo(String imgName){
        System.out.println("进入了识别图片");
        byte[] data = null;
        InputStream in = null;
        try{
            in = new FileInputStream(imgUrl+imgName);
            data = new byte[in.available()];
            in.read(data);
            in.close();
        }catch (Exception e){
            e.printStackTrace();
        }
        String image = Base64.encodeBase64String(data);
        System.out.println(image);
        MultiValueMap<String, String> postParameters = new LinkedMultiValueMap<>();
        HttpHeaders headers = new HttpHeaders();
        postParameters.add("image",image);
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        HttpEntity<MultiValueMap<String, String>> r = new HttpEntity<>(postParameters, headers);
        return r;
    }
    //识别ocr返回的字符
    public String processCroInfo(JSONObject jsonObject){
//        System.out.println(jsonObject);
        JSONArray jsonArray = jsonObject.getJSONArray("words_result");
        StringBuffer sb = new StringBuffer();
        StringBuffer sb2 = new StringBuffer();
        for (int i = 0; i < jsonArray.size(); i++) {
            sb.append(((JSONObject)jsonArray.get(i)).getString("words"));
        }
        System.out.println(sb.toString());
        char[] data = sb.toString().toCharArray();
        for (int i = 0; i < data.length; i++) {
            if(data[i] > 47 && data[i] < 58){
                sb2.append(data[i]);
            }else {
                int length = sb2.length();
                if(length < 10){
                    if (length > 0){
                        sb2.delete(0,length);
                    }
                }else {
                    break;
                }
            }
        }
        return sb2.toString();
    }

    //贵重信息个数
    public void pushInfo(){
        if(infoRepository.valuableCount() > 0){
            getManager(1);
        }
    }
    //举报信息个数
    public void pushReport(){
        if(reportCommentRepository.commentCount()+reportRepository.infoCount() > 0){
            getManager(2);
        }
    }
    //随机分配一个管理员
    public void getManager(int type){
        if(infoRepository.valuableCount() > 0){
            List<ManagerMysql> managers = manageRepository.findAll();
            int size = managers.size();
            int tag = 0;
            String[] formId;
            String token = getAccessToken().getString("access_token");
            do {
                tag = new Random().nextInt(size);
                formId = managers.get(tag).getFormId().split("\\+");
            }while (formId.length > 0);
            if(type == 1){
                String[] infos = {"有贵重信息待审核","请管理员速去小程序审核"};
                sendTemplateInfo(infos,token,managers.get(tag).getOpenId(),formId[formId.length-1],"2Hc70ZWJ87E_H8MIQ47rKTnY5NKhRqkfdFmQBl54I8g");
            }else if (type == 2){
                String[] infos = {"有举报信息待审核","请管理员速去小程序审核"};
                sendTemplateInfo(infos,token,managers.get(tag).getOpenId(),formId[formId.length-1],"2Hc70ZWJ87E_H8MIQ47rKTnY5NKhRqkfdFmQBl54I8g");
            }
        }
    }
    //发送模板信息
    public Object sendTemplateInfo(String[] infos,String accessToken, String openid,String formId,String tempId){
        String url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token="+accessToken;
        //构造模板
        JSONObject jsonObject = makeTemplateData(infos,openid,formId,tempId);
        return restTemplate.postForEntity(url,jsonObject,JSONObject.class).getBody();
    }
    //构造模板信息JSON
    public JSONObject makeTemplateData(String[] infos,String openid ,String formId,String tempId){
        JSONObject data = new JSONObject();
        int j = 0;
        for (int i = 0; i < infos.length; i++) {
            JSONObject value = new JSONObject();
            value.put("value",infos[i]);
            j = i + 1;
            data.put("keyword"+j,value);
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("touser", openid);
        jsonObject.put("template_id",tempId);
        jsonObject.put("form_id", formId);
        jsonObject.put("data",data);
        return jsonObject;
    }
    //写入感谢墙
    public void writeThanks(String openid, String current, String nickName,String message ,String img){
        ThanksMysql thanksMysql = new ThanksMysql(openid, current, nickName, message, img);
        thanksRepository.save(thanksMysql);
    }
    //构造通知结束信息
    public Object makeInformInfo(String accessToken, String openid, String category, String current, String nickName,
                                 String message, int id,String img,String type,String content){
        if(content.length() > 10){
            this.writeThanks(openid, current, nickName, content, img);
        }
        InfoMysql infoMysql = infoRepository.findById(id).get();
//        Date date = new Date();
//        SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd hh:mm:ss");
//        current = sdf.format(date);
        //删除已使用的formid
        String formid = getFormId(infoMysql);
        if(!formid.equals("none")){
            String[] infos = {category,type,nickName,current,message,"请您进入小程序->个人主页->正在发布中确认"};
            return sendTemplateInfo(infos,accessToken,openid,formid,"RxgaGC2KYvrcsD_ZviRM3pXonDsQUPUrXDPKOrIeESo");
        }
        return false;
    }
    //获得FormId
    public String getFormId(InfoMysql infoMysql){
        //删除已使用的formid
        if(!(infoMysql.getFormId().equals(""))){
            String[] formIdList = infoMysql.getFormId().split("\\+");
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < formIdList.length-1; i++) {
                sb.append(formIdList[i] + "+");
            }
            infoMysql.setFormId(sb.toString());
            infoRepository.save(infoMysql);
            return formIdList[formIdList.length-1];
        }else {
            return "none";
        }
    }
    //审核结果通知
    public void reviewResult(String title,String result,String openid,String formId){
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd hh:mm:ss");
        String token = getAccessToken().getString("access_token");
        String[] infos = {title,"贵重物品",result,sdf.format(date)};
        sendTemplateInfo(infos,token,openid,formId,"513bcedzNN8rQoIDm4IePFe3E2BTpW4dZ6d5TJ3-osY");
    }
    public Template(){
        logger.info("Template加入了SpringIoc容器");
    }
}
