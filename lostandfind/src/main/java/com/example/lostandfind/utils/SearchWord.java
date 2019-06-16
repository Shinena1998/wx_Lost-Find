package com.example.lostandfind.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.*;
import java.util.LinkedList;
import java.util.List;

@Configuration
public class SearchWord {

    //失物关键词集合
    @Bean(name = "labelWord")
    public List<String> labelWord() throws Exception{
        return this.getInfo("label.txt");
    }
    //推荐搜索集合
    @Bean(name= "pushWord")
    public List<String> pushWord() throws Exception{
        return this.getInfo("search.txt");
    }
    public List<String> getInfo(String path) throws Exception{
        Resource resource = new ClassPathResource(path);
        InputStream inputStream =  resource.getInputStream();
        InputStreamReader inputStreamReader = new InputStreamReader(inputStream,"UTF-8");
        BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
        List<String> list = new LinkedList<>();
        String str1 = null;
        while((str1 = bufferedReader.readLine()) != null){
            list.add(str1);
        }
        bufferedReader.close();
        inputStreamReader.close();
        inputStream.close();
        return list;
    }
}
