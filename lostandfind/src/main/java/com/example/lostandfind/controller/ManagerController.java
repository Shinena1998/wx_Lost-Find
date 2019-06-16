package com.example.lostandfind.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.*;
import com.example.lostandfind.repository.*;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    @Autowired
    private PersonInfoRespository personInfoRespository;

    @Autowired
    private ManageRepository manageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EvaluateRespository evaluateRespository;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private FinishRespository finishRespository;
    @GetMapping(value = "/look")
    public List<PersonInfoMysql> look(){
        JSONObject asd = new JSONObject();
        List<ManagerMysql> managerList = manageRepository.findAll();
        Set<String> openidSet = new HashSet<>();
        for (int i = 0; i < managerList.size(); i++) {
            openidSet.add(managerList.get(i).getOpenId());
        }
        List<Integer> numList = userRepository.getManagerOpenId(openidSet);
        List<PersonInfoMysql> managerPersonInfoList = personInfoRespository.getManagerPersonInfo(numList);
        return managerPersonInfoList;
    }
    @GetMapping(value = "/getInfo")
    public Object getInfo(@RequestParam("num") String num){
        return personInfoRespository.findByNum(num);
    }
    @GetMapping(value = "/addManager")
    public String addManager(@RequestParam("openId") String openId){
        if(manageRepository.findByOpenId(openId) == null){
            ManagerMysql managerMysql = new ManagerMysql();
            managerMysql.setOpenId(openId);
            managerMysql.setFormId("needAdd");
            manageRepository.save(managerMysql);
            return "添加成功";
        }else {
            return "该用户已经是管理员";
        }
    }

    @GetMapping(value = "/deleteManager")
    public String deleteManager(@RequestParam("openId") String openId){
        ManagerMysql managerMysql = manageRepository.findByOpenId(openId);
        if(managerMysql != null){
            manageRepository.delete(managerMysql);
            return "删除成功";
        }else {
            return "该用户不是管理员，无需删除";
        }
    }
    @GetMapping(value = "/getEva")
    public JSONArray getEva(){
        List<EvaluateMysql> evaluateList = evaluateRespository.findAll();
        int[] ui = {0,0,0,0,0,0};
        int[] feel = {0,0,0,0,0,0};
        int[] use = {0,0,0,0,0,0};
        int[] load = {0,0,0,0,0,0};
        for (int i = 0; i < evaluateList.size(); i++) {
            if(evaluateList.get(i).getUiL() != -1){
                ui[evaluateList.get(i).getUiL()-1]++;
            }
            if(evaluateList.get(i).getFeelL() != -1){
                feel[evaluateList.get(i).getFeelL()-1]++;
            }
            if(evaluateList.get(i).getUseL() != -1){
                use[evaluateList.get(i).getUseL()-1]++;
            }
            if(evaluateList.get(i).getLoadL() != -1){
                load[evaluateList.get(i).getLoadL()-1]++;
            }
        }
        for (int i = 0; i < 5; i++) {
            ui[5] = ui[5] + ui[i];
            feel[5] = feel[5] + feel[i];
            use[5] = use[5] + use[i];
            load[5] = load[5] + load[i];
        }
        JSONArray jsonArray = new JSONArray();
        jsonArray.add(ui);
        jsonArray.add(feel);
        jsonArray.add(use);
        jsonArray.add(load);
        return jsonArray;
    }

    @GetMapping(value = "/login")
    public String login(@RequestParam("username") String name,
                        @RequestParam("password") String pass,
                        HttpServletResponse response,
                        HttpServletRequest request){
        String origin = request.getHeader("Origin");
        System.out.println(request.getHeader("Origin"));

        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        String password = manageRepository.getSuperManager(name);
        if(pass.equals(password)){
            String redisKey = new Date().getTime()/1000+"";
            Cookie cookie = new Cookie("key",redisKey);
            cookie.setMaxAge(1800);
            cookie.setPath("/"); //默认为一级目录
            cookie.setDomain("yuigahama.xyz");//jdk默认为一级域名
            response.addCookie(cookie);

            stringRedisTemplate.opsForValue().set(redisKey,"true",1800, TimeUnit.SECONDS);
            return "successful";
        }else {
            return "fail";
        }
    }

    @GetMapping(value = "/getLogin")
    public boolean getLogin(HttpServletRequest request,
                            HttpServletResponse response){
        String origin = request.getHeader("Origin");
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        Cookie[] cookies = request.getCookies();
        if (cookies == null){
            return false;
        }
        String redisKey = "";
        for (int i = 0; i < cookies.length; i++) {

            System.out.println(cookies[i].getName()+" "+cookies[i].getValue());
            if(cookies[i].getName().equals("key")){
                redisKey = cookies[i].getValue();
                System.out.println(cookies[i].getValue());
            }
        }
        if (stringRedisTemplate.hasKey(redisKey)){
            if("true".equals(stringRedisTemplate.opsForValue().get(redisKey))){
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }
    @GetMapping(value = "/getSchool")
    public List<PersonInfoMysql> getSchool(){
        return personInfoRespository.findAll();
    }

    @GetMapping(value = "/exit")
    public boolean exit(HttpServletRequest request,
                        HttpServletResponse response){
        String origin = request.getHeader("Origin");
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Access-Control-Allow-Credentials", "true");
        Cookie[] cookies = request.getCookies();
        if (cookies == null){
            return true;
        }
        String redisKey = "";
        for (int i = 0; i < cookies.length; i++) {
            System.out.println(cookies[i].getName()+" "+cookies[i].getValue());
            if(cookies[i].getName().equals("key")){
                redisKey = cookies[i].getValue();
                System.out.println(cookies[i].getValue());
            }
        }
        if(stringRedisTemplate.hasKey(redisKey)){
            stringRedisTemplate.delete(redisKey);
            return true;
        }else{
            return true;
        }
    }

    @GetMapping("/getFinish")
    public List<FinishMysql> getFinish(){
        Sort sort = new Sort(Sort.Direction.DESC,"id");
        return finishRespository.findAll(sort);
    }
    @GetMapping("/getSearchFinish/{start}/{end}")
    public List<FinishMysql> getSearchFinish(@PathVariable("start") String start,
                                             @PathVariable("end") String end){
        return finishRespository.getSearchFinish(start,end);
    }

}

