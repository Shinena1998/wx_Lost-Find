package com.example.lostandfind.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.Repository.*;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.mapper.InfoMapper;
import com.example.lostandfind.mysql.*;
import com.example.lostandfind.service.*;
import com.example.lostandfind.utils.ChangeListUtil;
import com.example.lostandfind.utils.ResultUtil;
import com.example.lostandfind.utils.Template;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpMethod;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import javax.xml.crypto.Data;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@RestController
public class LafController{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InfoMapper infoMapper;

    @Autowired
    private InfoRepository infoRepository;

    @Autowired
    private ManageRepository manageRepository;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private SuggestRepository suggestRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private FinishRespository finishRespository;

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
        if(userRepository.findByOpenId(openid).isEmpty()){
            return true;
        }else {
            return false;
        }
    }

    @GetMapping(value = "/openid1/{openid}")
    public List<UserMysql> checkOpenId1(@PathVariable("openid") String openid){
        return userRepository.findByOpenId(openid);
    }

    /**
     * 查询待审核物品
     * @param confirm
     * @return
     */
    @GetMapping(value = "/valuable")
    public List<InfoMysql> searchValuableInfo(@RequestParam("confirm") boolean confirm){
        return infoRepository.findByIsValuable(confirm);
    }
    @GetMapping(value = "/service/info")
    public List<InfoMysql> searchInfo(@RequestParam("confirm") boolean confirm,
                                      @RequestParam("count") int count){
        System.out.println(count);
        return infoRepository.findByABoolean(confirm,50*count);
    }
    /**s
     * 写入数据信息
     * @param infoMysql
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/msg")
//    public Result addMsg(@Valid InfoMysql infoMysql,BindingResult bindingResult){
    public Result addMsg(@RequestBody InfoMysql infoMysql) throws Exception {
        InfoService infoService = new InfoService();
        if (infoService.hasError(infoMysql)) {
            return ResultUtil.error(12, "填全内容");
        }
        infoMysql.setTimestamps((new Date().getTime())/1000);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        infoMysql.setLoststamp(simpleDateFormat.parse(infoMysql.getTime()).getTime()/1000 + 1000);
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

    /**
     * 向本地上传图片
     * @param file 图片的二进制字节流
     * @return
     * @throws Exception
     */
//    @PostMapping(value = "/uploadImage")
//    public String uploadPicture(@RequestParam("file") MultipartFile file,
//                                @RequestParam("height") int height,
//                                @RequestParam("width") int width,
//                                @RequestParam("openid") String openid) throws Exception {
//
//       System.out.println(height +" "+width + openid);
//        //获取文件需要上传到的路径
//        if(file.isEmpty()==true){
//            return "error";
//        }else {
//            String imgType = file.getOriginalFilename().split("\\.")[file.getOriginalFilename().split("\\.").length-1];
//            String imgName = height + "+" + width + "+" + new Date().getTime() + openid +'.'+imgType;
//            byte[] bytes = file.getBytes();
//            Path path = Paths.get("/Users/zhangcong/WeChatApp/pages/img/"+ imgName);
//            Files.write(path,bytes);
//            return "/pages/img/"+imgName;
//        }
//    }
    /**
     * 向服务器端传图片
     */
    @PostMapping(value = "/uploadImage")
    public String uploadPicture(@RequestParam("file") MultipartFile file,
                                @RequestParam("height") int height,
                                @RequestParam("width") int width,
                                @RequestParam("openid") String openid) throws Exception {
        //获取文件需要上传到的路径

        if(file.isEmpty()==true){
            return "error";
        }else {
            String imgType = file.getOriginalFilename().split("\\.")[file.getOriginalFilename().split("\\.").length-1];
            String imgName = height + "+" + width + "+" + new Date().getTime() + openid +'.'+imgType;
            byte[] bytes = file.getBytes();
            Path path = Paths.get("/root/html/img/"+ imgName);
            Files.write(path,bytes);
            return "https://yuigahama.xyz/img/"+imgName;
        }
    }

    @ResponseBody
    @PutMapping(value = "/confirm/{id}")
    public InfoMysql doConfirm(@PathVariable("id") Integer id,
                               @RequestBody ConfirmService confirm){
        InfoMysql infoMysql = infoRepository.findById(id).get();
        infoMysql.setConfirm(confirm.isConfirm());
        return infoRepository.save(infoMysql);
    }
    /**
     * 管理员
     */
    @PostMapping(value ="/manager/{openid}")
    public Boolean doManager(@PathVariable("openid") String openid){
        if(manageRepository.findByOpenId(openid) != null){
            return true;
        }else {
            return false;
        }
    }
    /**
     *是否同意审核
     * 经过审核后Valubable变为0，由aBoolean再来进行判断贵重
     * 因为事件审核后要消失，所以选择Valubable变量来控制在审核界面的显示
     * aBoolean则控制在信息显示界面的显示
     */
    @PutMapping(value="/check/{id}")
    public String doCheck(@PathVariable("id") Integer id,
                          @RequestBody ConfirmService confirmService){
        InfoMysql infoMysql =  infoRepository.findById(id).get();
        infoMysql.setaBoolean(confirmService.isConfirm());
        infoMysql.setValuable(false);
        infoRepository.save(infoMysql);
        return "asd"+confirmService.isConfirm();
    }
    /**
     * 结束事件
     */
    @DeleteMapping(value="/finish/{id}")
    public String doFinish(@PathVariable("id") Integer id){
        InfoMysql infoMysql =  infoRepository.findById(id).get();
        infoRepository.deleteById(id);
        FinishMysql finishMysql = new FinishMysql();
        finishMysql.setCategory(infoMysql.getCategory());
        finishMysql.setContactWay(infoMysql.getContactWay());
        finishMysql.setIdentity(infoMysql.getIdentity());
        finishMysql.setInfomation(infoMysql.getInfomation());
        finishMysql.setKind(infoMysql.getKind());
        finishMysql.setPicPath(infoMysql.getPicPath());
        finishMysql.setTheme(infoMysql.getTheme());
        finishMysql.setTime(infoMysql.getTime());
        finishMysql.setPlace(infoMysql.getPlace());
        finishMysql.setCurrent(infoMysql.getCurrent());
        finishMysql.setTimeOut(false);
        finishRespository.save(finishMysql);
        return "success";
    }
    /**
     * 模糊搜索
     */
    @GetMapping(value = "/search/{index}/{string}/{count}")
    @ResponseBody
    public List<InfoMysql> doSearch(@PathVariable("string") String name,
                                    @PathVariable("index") Integer index,
                                    @PathVariable("count") Integer count) throws Exception{
        List<InfoMysql> infoMysqlList = null;
        if(index == 0){
             infoMysqlList = infoRepository.findByInfoTheme(name,count*10);
        }else if(index == 1) {

            Sort sort = new Sort(Sort.Direction.ASC, "loststamp");
            infoMysqlList = infoRepository.findAll(sort);
            return new TimeSelectService().timeSelect(name,infoMysqlList);

        }
        return infoMysqlList;
    }
    /**
     * 更新历史查询，包括增加删除
     */
    @ResponseBody
    @PutMapping(value = "/search/history")
    public HistoryMysql doAddHistory(@RequestBody HistoryMysql historyMysql){
        String history;
        historyMysql.setHistory(new ChangeListUtil(historyMysql.getHistoryList() , historyMysql.getIndexList()).changeHistoryListUtil());
        historyMysql.setPicker(new ChangeListUtil(historyMysql.getHistoryList() , historyMysql.getIndexList()).changeIndexListUtil());
        if(historyRepository.findByOpenid(historyMysql.getOpenid()) == null){
            return historyRepository.save(historyMysql);
        }else {
            HistoryMysql historyMysql1 = historyRepository.findByOpenid(historyMysql.getOpenid());
            historyMysql1.setHistoryList(historyMysql.getHistoryList());
            historyMysql1.setHistory(historyMysql.getHistory());
            historyMysql1.setIndexList(historyMysql.getIndexList());
            historyMysql1.setPicker(historyMysql.getPicker());
            return historyRepository.save(historyMysql1);
        }
    }
    /**
     * 获得历史查询
     */
    @ResponseBody
    @GetMapping(value="/search/history/{openid}")
    public HistoryMysql doSearchHistory(@PathVariable("openid") String openid) {
        HistoryMysql historyMysql = historyRepository.findByOpenid(openid);
        if(historyMysql != null) {
            if (historyMysql.getHistory() != null) {
                historyMysql.setHistoryList(historyMysql.getHistory().split("\\+"));
                historyMysql.setIndexList(historyMysql.getPicker().split("\\+"));
            }
            return historyMysql;
        }else {
            HistoryMysql historyMysql1 = new HistoryMysql();
            historyMysql1.setOpenid(openid);
            historyMysql1.setEye("/pages/img/AD1B0CBA-D334-4B9A-A000-F82D33119671.png");
            historyRepository.save(historyMysql1);
            return historyMysql1;
        }
    }
    /**
     * 是否查看历史查询
     */
    @ResponseBody
    @PutMapping(value="/search/eye")
    public HistoryMysql doaChangeEye(@RequestBody HistoryMysql historyMysql) {
        HistoryMysql historyMysql1 = historyRepository.findByOpenid(historyMysql.getOpenid());
        historyMysql1.setEye(historyMysql.getEye());
        return historyRepository.save(historyMysql1);
    }
    /**
     * 删除所有历史记录
     */
    @ResponseBody
    @DeleteMapping(value="/search/detele/{openid}")
    public HistoryMysql doDelete(@PathVariable("openid") String openid){
        HistoryMysql historyMysql = historyRepository.findByOpenid(openid);
        historyMysql.setHistory(null);
        historyMysql.setPicker(null);
        return historyRepository.save(historyMysql);
    }
    /**
     * 生成token
     */
    @ResponseBody
    @GetMapping(value = "/token")
    public TokenService makeToken(HttpServletRequest request){

        HttpSession session = request.getSession();
        TokenService tokenService = new TokenService();
        String token = tokenService.makeToken();
        session.setAttribute("token",token);
        tokenService.setToken(token);
        tokenService.setSession(session.getId());
        return tokenService;
    }
    /**
     * 写入用户建议
     */
    @ResponseBody
    @PostMapping(value = "/suggestion")
    public SuggestMysql WriteSuggestion(@RequestBody SuggestMysql suggestMysql){
        return suggestRepository.save(suggestMysql);
    }

    /**
     * 查看用户建议
     */
    @ResponseBody
    @GetMapping(value = "/suggestion")
    public List<SuggestMysql> GetSuggestion(){
        return suggestRepository.findAll();
    }
    /**
     * 为了安全，腾讯相关的api不能在前端调用，只能在服务端调用
     * 获取用户openid以及session_id,session_id用来解码用户信息，得到用户unionid
     */
    @ResponseBody
    @GetMapping(value = "/getUserInfo")
    public Object getUserInfo(@RequestParam("code") String code){
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc&js_code=" + code + "&grant_type=authorization_code";
        return restTemplate.exchange(url, HttpMethod.GET,null,String.class).getBody();
    }

    /**
     * 获取发送模板消息的token
     * @return
     */
    @ResponseBody
    @GetMapping(value = "/get_access_token")
    public Object getAccessToken(){
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxc8c90d2d684c76a0&secret=7f24acb9cb4cf67e2fd57993032de4dc";
        return restTemplate.exchange(url, HttpMethod.GET,null,String.class).getBody();
    }
    /**
     *发送模板信息
     */
    @ResponseBody
    @GetMapping(value = "/sendTemplateInfo")
    public Object sendTemplateInfo(@RequestParam("accessToken") String accessToken,
                                   @RequestParam("openid") String openid,
                                   @RequestParam("category") String category,
                                   @RequestParam("current") String current,
                                   @RequestParam("nickName") String nickName,
                                   @RequestParam("message") String message,
                                   @RequestParam("id") int id){
        InfoMysql infoMysql = infoRepository.findById(id).get();
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd hh:mm:ss");
        current = sdf.format(date);
        //删除已使用的formid
        if(!(infoMysql.getFormId().equals(""))){
            String[] formIdList = infoMysql.getFormId().split("\\+");
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < formIdList.length-1; i++) {
                sb.append(formIdList[i] + "+");
            }
            infoMysql.setFormId(sb.toString());
            infoRepository.save(infoMysql);


            String url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token="+accessToken;
            String[] infos = {category,"已找到失主",nickName,current,message,"请您去小程序内确认"};
            JSONObject jsonObject = new Template().makeTemplateData(infos,openid,formIdList[formIdList.length-1]);
            return restTemplate.postForEntity(url,jsonObject,JSONObject.class).getBody();
        }
        return false;
    }
    /**
     * 搜索自己未完成信息
     */
    @ResponseBody
    @GetMapping(value = "/aboutMeNot")
    public List<InfoMysql> getNotFinish(@RequestParam("openid") String openid){
        return infoRepository.findByIdentity(openid);
    }
    /**
     * 搜索自己已完成信息
     */
    @ResponseBody
    @GetMapping(value = "/aboutMeHas")
    public List<FinishMysql> getHasFinish(@RequestParam("openid") String openid){
        return finishRespository.findByIdentity(openid);
    }

    /**
     * 测试mybatis分页功能
     * @return
     */
    @GetMapping(value ="/manager")
    public Page<ManagerMysql> getManager(){
        System.out.println(PageHelper.startPage(1,10));
        return infoMapper.findByPage();
    }

    /**
     * 实现添加用户在添加证件信息时，如果有相同证件信息已发表，则直接弹出信息功能
     * 证件卡号与物品详细信息用"+"连接，故需要将证件卡号从详细信息中分开在做匹配
     * @param card
     * @return
     */
    @GetMapping(value = "/Card")
    public InfoMysql getCardInfo(@RequestParam("card") String card) {
        List<InfoMysql> infoMysqls = infoRepository.findByCategory("证件");
        List<String> cardnum = new LinkedList<String>();
        for (int i = 0; i < infoMysqls.size(); i++) {
            String info = infoMysqls.get(i).getInfomation();
            int label = info.lastIndexOf("+");//得到"+"标记的位置
            if(label == -1){
                continue;
            }
            info = info.substring(label+1);//截取"+"以后的证件卡号
            System.out.println(info + " " + card);
            if(info.equals(card)){
                return infoMysqls.get(i);
            }
        }
        return null;
    }
}
