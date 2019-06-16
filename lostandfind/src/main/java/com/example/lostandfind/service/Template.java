package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.LostandfindApplication;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.ManagerMysql;
import com.example.lostandfind.mysql.SystemInformMysql;
import com.example.lostandfind.mysql.ThanksMysql;
import com.example.lostandfind.repository.*;
import com.example.lostandfind.restTemplate.RestTemplateConfig;
import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.seg.Segment;
import com.hankcs.hanlp.seg.common.Term;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    @Autowired
    private SystemInformRepository systemInformRepository;

    @Autowired
    private InfoService infoService;

    @Value("${appId.xutLf}")
    private String appId;

    @Value("${appSecret.xutLf}")
    private String secret;

    @Value("${formId.remind}")
    private String remind;

    @Value("${formId.check}")
    private String check;

    public JSONObject getAccessToken(){
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+secret;
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
        for (int i = 0; i < jsonArray.size(); i++) {
            sb.append(((JSONObject)jsonArray.get(i)).getString("words"));
        }
        Segment segment = HanLP.newSegment().enableNameRecognize(true);

        List<Term> termList = segment.seg(sb.toString());
        String name = "noName+";
        String number = "noNumber+unknownType";
        for (int i = 0; i < termList.size(); i++) {
            //nr表示人名
            if(termList.get(i).nature.toString().equals("nr")){
                name = termList.get(i).word + "+";
             // /m表示一串数字，数字长度大于无才会被记录
            } else if(termList.get(i).nature.toString().equals("m") && termList.get(i).word.length() > 9){
                number = termList.get(i).word;
                // 验证带x身份证
                if(number.length() == 17 && termList.get(i+1).word.equals("x")){
                    number = number + "x+身份证";
                }else {
                    number = judgeType(number);
                }
            }
        }
        return name+number;
    }
    //判断信息类型
    public String judgeType(String number){
        int length = number.length();
        if(length == 10){ //一卡通
            number = number + "+一卡通";
        }else if(length == 18){ //身份证纯数字
            number = number + "+身份证";
        }else if(length == 19){ //银行卡
            number = number + "+银行卡";
        }else if(length == 18){ //公交卡

        }else if(length == 18){ //洗衣卡

        }else if(length == 18){ //洗澡卡

        }else {
            number = number + "+unknownType";
        }
        return number;
    }
    //识别一卡通信息
    public String processAcard(JSONObject jsonObject){
//        System.out.println(jsonObject);
        JSONArray jsonArray = jsonObject.getJSONArray("words_result");
        System.out.println(jsonArray);
        StringBuffer sb = new StringBuffer();
        for (int i = jsonArray.size()-1; i >= 0; i--) {
            if(!Pattern.matches(".*:.*",((JSONObject)jsonArray.get(i)).getString("words"))){
                jsonArray.remove(i);
            }
        }
        String num =null;
        String name = null;
        for (int i = 0; i < jsonArray.size(); i++) {
            //字符串长度小于五，认为不是需要的信息
            if(((JSONObject)jsonArray.get(i)).getString("words").length() < 5){
                continue;
            }
            //获取学号
            if(Pattern.matches("学号.*",((JSONObject)jsonArray.get(i)).getString("words"))){
                num = ((JSONObject)jsonArray.get(i)).getString("words").split(":")[1];
                if(num.length() != 10){
                    this.onlyNum(num);//匹配的学号可能会被污染
                }
            //获取姓名
            }else if(Pattern.matches("姓名.*",((JSONObject)jsonArray.get(i)).getString("words"))){
                name = ((JSONObject)jsonArray.get(i)).getString("words").split(":")[1];
            }
            sb.append(((JSONObject)jsonArray.get(i)).getString("words")+"\n");
            if(i == jsonArray.size()-1){
                sb.append("+" + num + "+" + name);
            }
        }
        String result = sb.toString();
        if(num == null || name == null){
            result = "未识别出关键信息！请手动填写";
        }
        return result;
    }
    //证件卡号有时会有其他信息加入
    public String onlyNum(String num){
        String REGEX = "\\w{10}"; //在字符串中检索10位数字
        Pattern pattern = Pattern.compile(REGEX); //进行配置
        Matcher matcher = pattern.matcher(num); //配置成功获得每段位置
        if(matcher.find()){
            return num.substring(matcher.start(),matcher.end()); //返回切分后学号
        }else{
            return "卡号识别失败！请手动填写";
        }
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
        List<ManagerMysql> managers = manageRepository.findAll();

        //用mark来标记是否所有管理员都没有formId
        boolean mark = false;
        for (int i = 0; i < managers.size(); i++) {
            if(!managers.get(i).getFormId().equals("useAfter") &&
                    !managers.get(i).getFormId().equals("needAdd") ){
                mark = true;
            }
        }
        int size = managers.size();
        int tag = 0;
        String formId = "";
        String token = getAccessToken().getString("access_token");
        //如果还有人有formId
        if (mark){
            Set<Integer> set = new HashSet<Integer>();
            while (true){
                tag = new Random().nextInt(size);
                if(set.contains(tag)){
                    continue;
                }else{
                    set.add(tag);
                }
                formId = managers.get(tag).getFormId();
                //通知完就消耗掉formid标志
                if(formId.equals("useAfter")){
                    infoService.updateFormId(managers.get(tag).getOpenId(),"needAdd");
                //已经消耗掉还未补充标记
                }else if(formId.equals("needAdd")){
                }else{
                    infoService.updateFormId(managers.get(tag).getOpenId(),"useAfter");
                    break;
                }
            }
            if(type == 1){
                String[] infos = {"有贵重信息待审核","请管理员速去小程序审核"};
                sendTemplateInfo(infos,token,managers.get(tag).getOpenId(),formId,check);
            }else if (type == 2){
                String[] infos = {"有举报信息待审核","请管理员速去小程序审核"};
                sendTemplateInfo(infos,token,managers.get(tag).getOpenId(),formId,check);
            }
        }else{
            for (int i = 0; i < managers.size(); i++) {
                infoService.updateFormId(managers.get(i).getOpenId(),"needAdd");
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
        ThanksMysql thanksMysql = new ThanksMysql(openid, current, nickName, message, img,0);
        thanksRepository.save(thanksMysql);
    }
    //构造通知发布者信息
    public Object makeInformInfo(String accessToken, String openid, String category, String current, String nickName,
                                 String message, int id,String img,String type,String content){
//       如果留言长度大于10，则在感谢墙中显示，但目前不需要这个操作
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
            return sendTemplateInfo(infos,accessToken,openid,formid,remind);
        }
        return false;
    }
    //获得FormId
    public String getFormId(InfoMysql infoMysql){
        //删除已使用的formid
        if(!(infoMysql.getFormId().equals("无"))){
            String formId = infoMysql.getFormId();
            infoMysql.setFormId("无");
            infoRepository.save(infoMysql);
            return formId;
        }else {
            return "none";
        }
    }
    //num 发布贵重物品人员，openid，管理员
    //审核结果通知
    public void reviewResult(String content,String result,int num,String openid){
        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yy/MM/dd hh:mm:ss");
        SystemInformMysql systemInformMysql = new SystemInformMysql();
        systemInformMysql.setTitle("审核结果通知");
        systemInformMysql.setLook(false);
        systemInformMysql.setContent(content);
        systemInformMysql.setType(1);
        systemInformMysql.setTime(sdf.format(date));
        systemInformMysql.setInformer(num);
        systemInformMysql.setReported(openid);
        systemInformMysql.setReason(result);
        systemInformRepository.save(systemInformMysql);
    }
    public Template(){
        logger.info("Template加入了SpringIoc容器");
    }
}
