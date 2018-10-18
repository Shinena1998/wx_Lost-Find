package com.example.lostandfind.controller;

import com.example.lostandfind.Repository.HistoryRepository;
import com.example.lostandfind.Repository.InfoRepository;
import com.example.lostandfind.Repository.ManageRepository;
import com.example.lostandfind.Repository.UserRepository;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.mysql.HistoryMysql;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.UserMysql;
import com.example.lostandfind.service.ConfirmService;
import com.example.lostandfind.service.DecryptService;
import com.example.lostandfind.service.InfoService;
import com.example.lostandfind.service.TokenService;
import com.example.lostandfind.utils.ChangeListUtil;
import com.example.lostandfind.utils.ResultUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
public class LafController{
    private static final Logger logger = LoggerFactory.getLogger(LafController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InfoRepository infoRepository;

    @Autowired
    private ManageRepository manageRepository;

    @Autowired
    private HistoryRepository historyRepository;

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
        logger.info("openid={}",openid);
        logger.info("openid={}",userRepository.findByOpenId(openid).isEmpty());
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
    public List<InfoMysql> searchInfo(@RequestParam("confirm") boolean confirm){
        return infoRepository.findByABooleanAndFinalConfirmAndIsValuable(confirm,false,false);
    }
    /**s
     * 写入数据信息
     * @param infoMysql
     * @return
     */
    @ResponseBody
    @PostMapping(value = "/msg")
//    public Result addMsg(@Valid InfoMysql infoMysql,BindingResult bindingResult){
    public Result addMsg(@RequestBody InfoMysql infoMysql) {
        InfoService infoService = new InfoService();
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

    /**
     * 向本地上传图片
     * @param file 图片的二进制字节流
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/uploadImage")
    public String uploadPicture(@RequestParam("file") MultipartFile file) throws Exception {
        //获取文件需要上传到的路径

        if(file.isEmpty()==true){
            return "error";
        }else {
            byte[] bytes = file.getBytes();
            Path path = Paths.get("/Users/zhangcong/WeChatApp/pages/img/"+ file.getOriginalFilename());
            Files.write(path,bytes);
            file.getOriginalFilename();
            return "/pages/img/"+file.getOriginalFilename();
        }
    }
    /**
     * 向服务器端传图片
     */
//@PostMapping(value = "/uploadImage")
//public String uploadPicture(@RequestParam("file") MultipartFile file) throws Exception {
//    //获取文件需要上传到的路径
//
//    if(file.isEmpty()==true){
//        return "error";
//    }else {
//        byte[] bytes = file.getBytes();
//        Path path = Paths.get("/root/html/"+ file.getOriginalFilename());
//        Files.write(path,bytes);
//        file.getOriginalFilename();
//        return "https://yuigahama.info/"+file.getOriginalFilename();
//    }
//}

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
        logger.info("manager={}+{}",manageRepository.findByOpenId(openid),openid);
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
    @PutMapping(value="/finish/{id}")
    public String doFinish(@PathVariable("id") Integer id){
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        InfoMysql infoMysql =  infoRepository.findById(id).get();
        infoMysql.setFinalConfirm(true);
        //infoMysql.setFinalTime(df.format(new Date()));// new Date()为获取当前系统时间
        infoRepository.save(infoMysql);
        return "success";
    }
    /**
     * 模糊搜索
     */
    @GetMapping(value = "/search/{index}/{string}")
    @ResponseBody
    public List<InfoMysql> doSearch(@PathVariable("string") String name,
                                    @PathVariable("index") Integer index){
        List<InfoMysql> infoMysqlList = null;
        if(index == 0){
             infoMysqlList = infoRepository.findByInfoTheme(name);
        }else if(index == 1){
            infoMysqlList = infoRepository.findByInfoTime(name);
        }else if(index == 2){
            infoMysqlList = infoRepository.findByInfoPlace(name);
        }else if(index == 3){
            infoMysqlList = infoRepository.findByInfoInfomation(name);
        }
        return infoMysqlList;
    }
    /**
     * 更新历史查询
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
     * 搜索历史查询
     */
    @ResponseBody
    @GetMapping(value="/search/history/{openid}")
    public HistoryMysql doSearchHistory(@PathVariable("openid") String openid) {
        HistoryMysql historyMysql = historyRepository.findByOpenid(openid);
        if(historyMysql.getHistory() != null){
            historyMysql.setHistoryList(historyMysql.getHistory().split("\\+"));
            historyMysql.setIndexList(historyMysql.getPicker().split("\\+"));
        }
        return historyMysql;
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
     * 删除历史记录
     */
    @ResponseBody
    @DeleteMapping(value="/search/detele/{openid}")
    public HistoryMysql doDelete(@PathVariable("openid") String openid){
        HistoryMysql historyMysql = historyRepository.findByOpenid(openid);
        historyMysql.setHistory("");
        historyMysql.setPicker("");
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
        logger.info("token1={}",token);
        session.setAttribute("token",token);
        tokenService.setToken(token);
        tokenService.setSession(session.getId());
        logger.info("token2={}",session.getAttribute("token"));
        logger.info("token2={}",session.getAttribute("token"));
        return tokenService;
    }
}
