package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.*;
import com.example.lostandfind.repository.CommentRespository;
import com.example.lostandfind.repository.ReportCommentRepository;
import com.example.lostandfind.repository.SystemInformRepository;
import com.example.lostandfind.worker.Channel;
import com.example.lostandfind.worker.CommentThread;
import com.example.lostandfind.worker.IllegalComment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ReportCommentService {
    @Autowired
    private ReportCommentRepository reportCommentRepository;

    @Autowired
    private CommentRespository commentRespository;

    @Autowired
    private  SystemInformRepository sir;
    public String writeReport(JSONObject jsonObject){
        System.out.println(jsonObject);
        int id = jsonObject.getInteger("reportid");
        int userid = jsonObject.getInteger("userid");//举报用户
        int user_id = jsonObject.getInteger("user_id");//被举报用户
        String reason = jsonObject.getString("reason");
        UserMysql userMysql = new UserMysql();
        userMysql.setNum(userid);
        ReportCommentMysql reportCommentMysql = reportCommentRepository.findByReportId(id);
        //已对该信息举报
        if(reportCommentMysql != null){
            //该信息已被管理员处理，但管理员拒绝删除，其他人在此举报则无效
            if(reportCommentMysql.isProcess()){
                return "举报成功";
            }
            List<UserMysql> userMysqls = reportCommentMysql.getUsers();
            for (int i = 0; i < userMysqls.size(); i++) {
                if(userMysqls.get(i).getNum() == userid){
                    return "请勿多次举报";
                }
            }
            userMysqls.add(userMysql);
            reportCommentMysql.setUsers(userMysqls);
            int count = reportCommentMysql.getCount();
            String str = reportCommentMysql.getReason() +";"+reason;
            reportCommentMysql.setReason(str);
            reportCommentMysql.setCount(++count);
            reportCommentRepository.save(reportCommentMysql);
        }else{
            reportCommentMysql = new ReportCommentMysql();
            UserMysql user = new UserMysql();
            user.setNum(user_id);
            reportCommentMysql.setReportId(id);
            reportCommentMysql.setCount(1);
            reportCommentMysql.setProcess(false);
            reportCommentMysql.setOperator(0);
            reportCommentMysql.setUser(user);
            reportCommentMysql.setReason(reason);
            List<UserMysql> userMysqls = new ArrayList<UserMysql>();
            userMysqls.add(userMysql);
            reportCommentMysql.setUsers(userMysqls);
            reportCommentRepository.save(reportCommentMysql);
        }
        return "举报成功";
    }
    public JSONArray getReport(){
        List<ReportCommentMysql> reportComments = reportCommentRepository.findByProcessOrderByReportId(false);
        if (reportComments.size() == 0){
            return new JSONArray();
        }
        JSONArray jsonArray = new JSONArray();
        Set<Integer> ids = new HashSet<>();
        for (int i = 0; i < reportComments.size(); i++) {
            ids.add(reportComments.get(i).getReportId());
        }
        List<CommentMysql> infos  = commentRespository.findidIn(ids);
        jsonArray.add(reportComments);
        jsonArray.add(infos);
        return jsonArray;
    }

    //管理员处理
    @Transactional
    public String process(boolean decide, int id, int operator,String time, Channel channel){
        ReportCommentMysql reportCommentMysql = reportCommentRepository.findByReportId(id);
        //如果在数据库找不到信息，就会返回一个很奇怪的commentMysql类型的数据，
        // 使用instanceof也返回true说明是同一类型。
        //但是所有值为null，使用get会发生异常
        String a = null;
        try {
             a = commentRespository.getOne(id).getContent();
        }catch (Exception e){
            reportCommentRepository.deleteById(id);
            return "该信息已被删除";
        }
        if(decide){
            reportCommentMysql.setProcess(true);
            reportCommentMysql.setOperator(operator);
            reportCommentRepository.save(reportCommentMysql);
            CommentMysql commentMysql = commentRespository.findById(id).get();


            new CommentThread("评论违规处理通知",commentMysql.getContent(),3,
                    commentMysql.getUid(),reportCommentMysql.getReason(),id,sir,time,channel).putRequest();
            commentRespository.delete(commentMysql);
            return "删除成功";
        }else{
            reportCommentMysql.setProcess(true);
            reportCommentMysql.setOperator(operator);
            reportCommentRepository.save(reportCommentMysql);
            return "操作成功";
        }
    }
}
