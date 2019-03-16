package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.restTemplate.RestTemplateConfig;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.FileInputStream;
import java.io.InputStream;

@Service
public class Template {
    final static String imgUrl = "/root/html/img";
//    final static String imgUrl = "/Users/zhangcong/WeChatApp/pages/img/";
    @Autowired(required = true)
    private RestTemplateConfig restTemplateConfig;
    //构造模板信息JSON
    public JSONObject makeTemplateData(String[] infos,String openid ,String formId){
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
        jsonObject.put("template_id","RxgaGC2KYvrcsD_ZviRM3pXonDsQUPUrXDPKOrIeESo");
        jsonObject.put("form_id", formId);
        jsonObject.put("data",data);
        return jsonObject;
    }
    //百度ocr识别图片
    public HttpEntity<MultiValueMap<String, String>> getOcrInfo(String imgName){
        byte[] data = null;
        InputStream in = null;
        try{
//            in = new FileInputStream(imgUrl+imgName);
            in = new FileInputStream(imgUrl+imgName);
            data = new byte[in.available()];
            in.read(data);
            in.close();
        }catch (Exception e){

        }
        String image = Base64.encodeBase64String(data);
//        System.out.println(image);
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
}
