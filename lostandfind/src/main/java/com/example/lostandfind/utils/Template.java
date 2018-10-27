package com.example.lostandfind.utils;

import com.alibaba.fastjson.JSONObject;

public class Template {
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
}
