package com.example.lostandfind.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.lucene.CreateIndex;
import com.example.lostandfind.repository.*;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.mapper.InfoMapper;
import com.example.lostandfind.mysql.*;
import com.example.lostandfind.service.*;
import com.example.lostandfind.utils.ChangeListUtil;
import com.example.lostandfind.utils.DivideWord;
import com.example.lostandfind.utils.ResultUtil;
import com.example.lostandfind.service.Template;
import com.example.lostandfind.worker.Channel;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.seg.Segment;
import com.hankcs.hanlp.seg.common.Term;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import javax.validation.Valid;
import java.util.*;

@RestController
public class LafController{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EvaluateRespository evaluateRespository;
    @Autowired
    private InfoMapper infoMapper;

    @Autowired
    private CommentRespository commentRespository;

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

    @Autowired
    private PersonInfoRespository personInfoRespository;

    @Autowired
    private StringRedisTemplate template;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ReportCommentRepository reportCommentRepository;

    @Autowired
    private InfoService infoService;

    @Autowired
    private Channel channel;

    @Autowired
    private PushRepository pushRepository;

    @Autowired
    private PushService pushService;

    @Autowired
    private ReportService reportService;

    @Autowired
    private SystemInformRepository systemInform;

    @Autowired
    private SystemInfomService systemInfomService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private Template templateService;

    @Autowired
    private SuggestionService suggestionService;

    @Autowired
    private PersonInfoService personInfoService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private ReportCommentService reportCommentService;

    @Autowired
    private CreateIndex createIndex;

//
//    @Autowired
//    private RedisTemplate<String,InfoMysql> redisTemplate;
    @Autowired
    private UserService userService;

    @Autowired
    private ThanksRepository thanksRepository;

    @Autowired
    private NewsRepository newsRepository;
    @GetMapping(value = "/getThanks")
    public List<ThanksMysql> getThanks(){
        return thanksRepository.findByTypeOrderByIdDesc(1);
//        return thanksRepository.findAll(new Sort(Sort.Direction.DESC,"id"));
    }

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
        return infoRepository.findByABooleanAndIsValuableOrderByTimestampsDesc(false,confirm);
    }

    /**
     *
     * @param confirm 判断获得贵重物品还是普通物品
     * @param count   页号
     * @return
     */
    @GetMapping(value = "/getValuable")
    public List<InfoMysql> getValuale(){
        return infoRepository.findByABooleanAndIsValuableOrderByTimestampsDesc(true,true);
    }
    @GetMapping(value = "/service/info")
    public List<InfoMysql> searchInfo(@RequestParam("confirm") boolean confirm,
                                      @RequestParam("count") int count){
        return infoService.pageInfo(count);
    }
    /**
     * 写入数据信息
     * @param infoMysql
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/msg/{name}")
//    public Result addMsg(@Valid InfoMysql infoMysql,BindingResult bindingResult){
    public Result addMsg(@RequestBody InfoMysql infoMysql,
                         @PathVariable("name") String name) throws Exception {
        return infoService.writeInfo(infoMysql,name,channel);
    }

    /**
     * 写入信息的点击次数
     * @param jsonObject
     * @return
     */
    @PostMapping(value="/addCount")
    public int addCount(@RequestBody JSONObject jsonObject){
        return infoService.addCount(jsonObject.getInteger("id"));
    }

    /**
     * 删除信息
     * @param jsonObject
     * @return
     */
    @DeleteMapping(value="/deleteInfo")
    public boolean deleteInfo(@RequestBody JSONObject jsonObject){
        return infoService.deleteInfo(jsonObject.getInteger("id"));
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


    @PostMapping(value = "/uploadNews")
    public NewsMysql uploadNews(@RequestParam("file") MultipartFile file,
                                @RequestParam("height") int height,
                                @RequestParam("width") int width,
                                @RequestParam("category") String category,
                                @RequestParam("openid") String openid,
                                @RequestParam("time") String time,
                                @RequestParam("name") String name,
                                @RequestParam("img") String img)throws Exception{
        return infoService.writeNews(file,height,width,category,openid,time,name,img);
    }
    @GetMapping(value = "/getNews")
    public List<NewsMysql> getNews(){
        return newsRepository.findAll(new Sort(Sort.Direction.DESC,"id"));
    }
    /**
     * 向服务器端传图片
     * @param file 图片的二进制字节流
     */
    @PostMapping(value = "/uploadImage")
    public Object uploadPicture(@RequestParam("file") MultipartFile file,
                                @RequestParam("height") int height,
                                @RequestParam("width") int width,
                                @RequestParam("category") String category,
                                @RequestParam("openid") String openid) throws Exception {
        //获取文件需要上传到的路径
//        return infoService.uploadPicS(file,height,width,category,openid,"img/");
        return infoService.uploadPic(file,height,width,category,openid,"img/");
    }

    @PostMapping(value = "/confirm/{id}/{confirm}")
    public InfoMysql doConfirm(@PathVariable("id") Integer id,
                               @PathVariable("confirm") boolean confirm){
        InfoMysql infoMysql = infoRepository.findById(id).get();
        infoMysql.setConfirm(confirm);
        return infoRepository.save(infoMysql);
    }
    /**
     * 管理员
     */
    @PostMapping(value ="/manager/{openid}")
    public String doManager(@PathVariable("openid") String openid){
        ManagerMysql managerMysql = manageRepository.findByOpenId(openid);
        if(managerMysql != null){
            return managerMysql.getFormId();
        }else {
            return "no";
        }
    }
    @PostMapping(value = "/addManagerFormId")
    public Result addManagerFormId(@RequestBody JSONObject jsonObject){
        infoService.updateFormId(jsonObject.getString("openid"),jsonObject.getString("formId"));
        return ResultUtil.success();
    }
    /**
     *是否同意审核
     * 经过审核后Valubable不变，由aBoolean再来进行判断贵重
     * 因为事件审核后要消失，所以选择Valubable 1 aBoolean 0变量来控制在审核界面的显示
     * Valubable 1 aBoolean 1则控制在信息显示界面的显示
     *
     * 还要改变
     */
    @PutMapping(value="/check/{id}/{confirm}/{formId}/{openId}/{num}")
    public Result doCheck(@PathVariable("id") Integer id,
                          @PathVariable("confirm") boolean confirm,
                          @PathVariable("formId") String formId,
                          @PathVariable("openId") String openId,
                          @PathVariable("num") int num){
        return infoService.passValuable(id,confirm,formId,openId,num);
    }
    @Autowired
    private SchedulerService schedulerService;
    /**
     * 结束事件
     */
    @DeleteMapping(value="/finish/{id}")
    public String doFinish(@PathVariable("id") Integer id){
        InfoMysql infoMysql =  infoRepository.findById(id).get();
        schedulerService.saveFinishInfo(infoMysql,false);
        return "success";
    }
    /**
     * 模糊搜索
     */
    @GetMapping(value = "/search/{index}/{string}/{count}")
    public List<InfoMysql> doSearch(@PathVariable("string") String name,
                                    @PathVariable("index") Integer index,
                                    @PathVariable("count") Integer count) throws Exception{
        List<InfoMysql> infoMysqlList = null;
        if(index == 0){
            return createIndex.getInfo(name,count+1);
//             infoMysqlList = infoRepository.findByInfoTheme(name,count*10);
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
    @GetMapping(value = "/getSuggestion")
    public JSONArray GetSuggestion(){
        return suggestionService.getSuggestion();
    }
    /**
     * 为了安全，腾讯相关的api不能在前端调用，只能在服务端调用
     * 获取用户openid以及session_id,session_id用来解码用户信息，得到用户unionid
     * 并且获取token
     */
    @GetMapping(value = "/getUserInfo")
    public Object getUserInfo(@RequestParam("code") String code){
        return tokenService.getUserInfo(code);
    }

    /**
     * 获取发送模板消息的token
     * @return
     */
    @ResponseBody
    @GetMapping(value = "/get_access_token")
    public JSONObject getAccessToken(){
        return templateService.getAccessToken();
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
                                   @RequestParam("id") int id,
                                   @RequestParam("img") String img,
                                   @RequestParam("content") String content,
                                   @RequestParam("type") String type){
        return templateService.makeInformInfo(accessToken,openid,category,current,nickName,message,id,img,type,content);
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
        return finishRespository.findByIdentityAndTimeOut(openid,false);
    }
    @ResponseBody
    @GetMapping(value = "/timeout")
    public List<FinishMysql> getTimeout(@RequestParam("openid") String openid){
        return finishRespository.findByIdentityAndTimeOut(openid,true);
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
        List<InfoMysql> infoMysqls = infoRepository.findByCardId(card);
        if (infoMysqls.size() > 0){
            return infoMysqls.get(0);
        }else{
            return null;
        }
    }

    //填写个人信息
    @ResponseBody
    @PostMapping("/writePersonInfo")
    public PersonInfoMysql writePersonInfo(@RequestBody PersonInfoMysql personInfo){
        PersonInfoMysql personInfoMysql = personInfoRespository.findByUser(personInfo.getUser());
        if(personInfoMysql == null){
            personInfoRespository.save(personInfo);
        }else {
            personInfo.setId(personInfoMysql.getId());
            personInfoRespository.save(personInfo);
        }
        return personInfo;
    }
    //获取个人信息
    @ResponseBody
    @GetMapping("/getPersonInfo")
    public PersonInfoMysql getPersonInfo(@RequestParam("id") int id) {
        return personInfoService.getPersonInfo(id);
    }
    //写入评价
    @ResponseBody
    @PostMapping("/writeEvaluate/{id}/{openid}/{level}")
    public EvaluateMysql writeEvaluate(@PathVariable("id") Integer id,
                                 @PathVariable("openid") Integer openid,
                                 @PathVariable("level") Integer level){
        EvaluateMysql evaluateMysql = evaluateRespository.findByOpenid(openid);
        if(evaluateMysql == null){
            evaluateMysql = new EvaluateMysql();
            evaluateMysql.setOpenid(openid);
            evaluateMysql.setUiL(-1);
            evaluateMysql.setFeelL(-1);
            evaluateMysql.setLoadL(-1);
            evaluateMysql.setUseL(-1);
        }
        if(id == 0){
            evaluateMysql.setUiL(level);
        }else if(id == 1){
            evaluateMysql.setFeelL(level);
        }else if(id == 2){
            evaluateMysql.setUseL(level);
        }else if(id == 3){
            evaluateMysql.setLoadL(level);
        }
        return evaluateRespository.save(evaluateMysql);
    }

    //得到评价
    @GetMapping("/getEvaluate")
    public EvaluateMysql getEvaluate(@RequestParam("openid") int openid){
        return evaluateRespository.findByOpenid(openid);
    }
    //测试物品信息视图
//    @GetMapping("/getInfoView")
//    public List<InfoView> getInfoView(){
//        return infoViewRepository.findAll();
//    }
    //从视图中得到某个物品的评论的
    @GetMapping("/getComment")
    public JSONArray getComment(@RequestParam("id") int id){
        return commentService.getComments(id);
    }
    //获得与某个用户相关评论
    @GetMapping("/getPersonComment")
    public   JSONObject getPersonComment(@RequestParam("openid") String openid) {
        return commentService.getPersonComments(openid);
    }
//    @PostMapping("/deletePersonInfo")
//    public Result writePersonInfo(@RequestParam("id") int id){
//        personInfoRespository.deleteById(id);
//        return ResultUtil.success();
//    }
    //写入评论
    @PostMapping("/writeComment/{user_id}/{info_id}")
    public CommentMysql writeComment(@PathVariable("info_id") Integer info, @PathVariable("user_id") Integer user,
                                     @RequestBody CommentMysql commentMysql){
        UserMysql userMysql = new UserMysql();
        userMysql.setNum(user);
        InfoMysql infoMysql = new InfoMysql();
        infoMysql.setId(info);
        commentMysql.setUser(userMysql);
        commentMysql.setInfo(infoMysql);
        return commentRespository.save(commentMysql);
    }
    //删除评论
    @DeleteMapping("/deleteComment/{id}")
    public void deleteComment(@PathVariable("id") Integer id){
        commentRespository.deleteById(id);
    }
    /**
     * 将评论未查看标记为查看
     * 0为@评论
     * 1为相关评论
     */
    @PostMapping("/changePersonComment/{openid}/{num}/{kind}")
    public Result changePersonComment(@PathVariable("openid") String openid,
                                    @PathVariable("num") int num,
                                    @PathVariable("kind") int kind){
       return commentService.changeRead(kind,num,openid);
    }

    //写入举报信息
    @PostMapping("/report")
    public String report(@RequestBody JSONObject jsonObject){
        return reportService.writeReport(jsonObject);
    }
    //读取举报信息
    @GetMapping("/getReport")
    public JSONArray getReport(){
        return reportService.getReport();
    }
    @GetMapping("/process")
    public String process(@RequestParam("decide") boolean decide,
                          @RequestParam("id") int id,
                          @RequestParam("operator") int operator,
                          @RequestParam("time") String time){
        return reportService.process(decide,id,operator,time,channel);
    }

    //写入举报信息
    @PostMapping("/reportComment")
    public String reportC(@RequestBody JSONObject jsonObject){
        return reportCommentService.writeReport(jsonObject);
    }
    //读取举报信息
    @GetMapping("/getReportComment")
    public JSONArray getReportC(){
        return reportCommentService.getReport();
    }
    @GetMapping("/processComment")
    public String processC(@RequestParam("decide") boolean decide,
                          @RequestParam("id") int id,
                          @RequestParam("operator") int operator,
                           @RequestParam("time") String time){
        return reportCommentService.process(decide,id,operator,time,channel);
    }
    @GetMapping("/getPushCount")
    public int getPushCount(@RequestParam("name") String name,
                            @RequestParam("look") boolean look){
        return pushRepository.name(name,look);
    }
    @GetMapping("/getPushInfo")
    public List<PushMysql> getPushInfo(@RequestParam("name") String name,
                                           @RequestParam("look") boolean look){
        return pushRepository.findByNameOrderByIdDesc(name);
    }

    //标记已经查看
    @PostMapping("/writePush")
    public String writePush(@RequestBody  JSONObject object){
        return pushService.writePush(object);
    }
    @GetMapping("/test")
    public List<PushMysql> test(@RequestParam("name") String name){
        return pushRepository.test(name);
    }

    @GetMapping("/test2")
    public List<Map<String,Object>> test2(@RequestParam("name") String name){
        return pushRepository.test2(name);
    }

    @GetMapping("/getSystemCount")
    public int getSystemCount(@RequestParam("id") int id,//id没用
                     @RequestParam("reported") String reported){
        return systemInform.informCount(reported);
    }
    @GetMapping("/getSystemInfo")
    public List<SystemInformMysql> getSystemInfo(@RequestParam("id") int id,
                                                 @RequestParam("reported") String reported){
        return systemInfomService.getSystemInfo(id,reported);
    }
    @GetMapping("/hasLookInfo")
    public int hasLookInfo(@RequestParam("mark") String mark){
        return systemInfomService.hasLookInfo(mark);
    }
    @PostMapping("/addCollect")
    public Result addCollect(@RequestBody JSONObject jsonObject){
        return userService.addCollect(jsonObject);
    }
    @GetMapping("/removeCollect")
    public Result reomveCollect(@RequestParam("num") int num,
                                @RequestParam("infoId") int infoId){
        return userService.removeCollect(num,infoId);
    }
    @GetMapping("/hasCollect")
    public Object hasCollect(@RequestParam("num") int num,
                          @RequestParam("infoId") int infoId){
        return userRepository.hasCollect(num,infoId);
    }
    @GetMapping("/collectInfos")
    public List<InfoMysql> collectInfos(@RequestParam("num") int num){
        return userRepository.searchCollect(num);
    }

    @GetMapping("/infoCount")
    public JSONObject infoCount(@RequestParam("openid") String openid){
        return infoService.infoCount(openid);
    }

    @PostMapping("/writeFormId")
    public Result writeFormId(@RequestBody JSONObject jsonObject){
        return userService.writeFormId(jsonObject);
    }

    @GetMapping("/createIndex")
    public String createIndex(){
        return createIndex.getLafInfo();
    }

    @GetMapping("/getInfo1")
    public Object getInfo(@RequestParam("keyWord") String keyWord,
                             @RequestParam("page") int page) throws Exception{
        return createIndex.getInfo(keyWord,page);
    }
    @DeleteMapping("/deleteNews")
    public Result deleteNews(@RequestBody JSONObject news){
        NewsMysql newInfo = news.getObject("news",NewsMysql.class);
        newsRepository.delete(newInfo);
        return ResultUtil.success();
    }
    @PostMapping("/writeThanks")
    public ThanksMysql writeThanks(@RequestBody ThanksMysql thanksMysql){
        return thanksRepository.save(thanksMysql);
    }

    @GetMapping("/getVersion")
    public double getVersion(){
        return 1.9;
    }
    @GetMapping("/testname")
    public void testname(@RequestParam("name") String name){
        Segment segment = HanLP.newSegment().enableNameRecognize(true);
        List<Term> termList = segment.seg(name);
        String name1 = "noName+";
        String number = "noNumber+";
        for (int i = 0; i < termList.size(); i++) {
            //nr表示人名
            System.out.println(termList.get(i).word + " " + termList.get(i).nature.toString());
            if(termList.get(i).nature.toString().equals("nr")){
                name1 = termList.get(i).word + "+";
                // /m表示一串数字，数字长度大于无才会被记录
            } else if(termList.get(i).nature.toString().equals("m") && termList.get(i).word.length() > 5){
                number = termList.get(i).word;
                if(number.length() == 17 && termList.get(i+1).word.equals("x")){
                    number = number + "x+身份证";
                }
            }
        }
        System.out.println(name1+number);
    }
    @GetMapping(value = "/testHTML")
    public JSONObject testHTML(){
        JSONObject asd = new JSONObject();
        asd.put("asd","asdasd");
        return asd;
    }
    @Autowired
    private DivideWord divideWord;

    @GetMapping(value = "/testDivide")
    public List<String> divide() throws Exception{
        return divideWord.getAllKey();
    }

}