package com.example.lostandfind.controller;

import com.example.lostandfind.Repository.InfoRepository;
import com.example.lostandfind.Repository.UserRepository;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import com.example.lostandfind.service.DecryptService;
import com.example.lostandfind.service.InfoService;
import com.example.lostandfind.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
public class LafController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InfoRepository infoRepository;

    @GetMapping(value = "/User")
    public List<UserMysql> UserList() {
        return userRepository.findAll();
    }

    @PostMapping(value = "/User")
    public Result addUser(@Valid UserMysql userMysql, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResultUtil.error(11, bindingResult.getFieldError().getDefaultMessage());
        }
        userRepository.save(userMysql);
        return ResultUtil.success(userMysql);
    }

    /**
     * 写入拾取人信息
     * @param userMysql
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/user")
    public Result addUser(@RequestBody UserMysql userMysql){
        userRepository.save(userMysql);
        return ResultUtil.success(userMysql);
    }

    @GetMapping(value = "/openid/{openid}")
    public boolean checkOpenId(@PathVariable("openid") String openid){
        if(userRepository.findByOpenId(openid)==null){
            return true;
        }else {
            return false;
        }
    }
    /**
     * 写入数据信息
     * @param infoMysql
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/msg")
//    public Result addMsg(@Valid InfoMysql infoMysql,BindingResult bindingResult){
    public Result addMsg(@RequestBody InfoMysql infoMysql) {
        InfoService infoService = new InfoService();
        System.out.println(infoMysql.getCategory());
        if (infoService.hasError(infoMysql)) {
            return ResultUtil.error(12, "填全内容");
        }

        infoRepository.save(infoMysql);
        return ResultUtil.success(infoMysql);

    }

    /**
     * 查看数据信息
     * @return
     */
    @GetMapping(value = "/msg")
    public List<InfoMysql> msgList() {
        return infoRepository.findAll();
    }

    /**
     * 解码拾取人信息
     * @param encryptedData
     * @param iv
     * @param session_key
     * @return
     */
    @GetMapping(value = "/identity")
    public Object decode(@RequestParam("encryptedData") String encryptedData,
                         @RequestParam("iv") String iv,
                         @RequestParam("session_key")String session_key) {
        encryptedData = encryptedData.replace(' ','+');
        iv = iv.replace(' ','+');
        session_key = session_key.replace(' ','+');
        DecryptService decryptUtil = new DecryptService();
        byte[] data = decryptUtil.decrypt(encryptedData, session_key, iv);
        String dataStr = null;
        try {
            dataStr = new String(data, "utf-8");
            // 根据解密算法自行解密(输入参数为appId,sessionKey,encryptedData,iv,返回一个jsonObj)
            System.out.println("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~" + dataStr);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println(dataStr);
        return dataStr;
    }
}
