package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.SuggestMysql;
import com.example.lostandfind.repository.SuggestRepository;
import com.google.gson.JsonObject;
import org.springframework.data.domain.Sort;

import java.util.List;

public class SuggestionService {
    public JSONArray getSuggestion(SuggestRepository suggestRepository){
        List<SuggestMysql> suggests = suggestRepository.findAll(new Sort(Sort.Direction.DESC,"id"));
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < suggests.size(); i++) {
            String[] dateinfo = suggests.get(i).getDate().split(" ");
            String date = dateinfo[0];
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("date",dateinfo[0]);
            jsonObject.put("time",dateinfo[1].substring(0,2));
            jsonObject.put("period",dateinfo[1].substring(2));
            jsonObject.put("nickName",suggests.get(i).getNickName());
            jsonObject.put("suggestion",suggests.get(i).getSuggestion());
            jsonObject.put("contactWay",suggests.get(i).getContactWay());
            jsonArray.add(jsonObject);
        }
        return jsonArray;
    }
}
