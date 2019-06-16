package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.mysql.*;
import com.example.lostandfind.repository.InfoRepository;
import com.example.lostandfind.repository.ReportCommentRepository;
import com.example.lostandfind.repository.ReportRepository;
import com.example.lostandfind.repository.SystemInformRepository;
import com.example.lostandfind.worker.Channel;
import com.example.lostandfind.worker.CommentThread;
import com.example.lostandfind.worker.IllegalComment;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private InfoRepository infoRepository;

    @Autowired
    private  SystemInformRepository sir;
    public String writeReport(JSONObject jsonObject){
        int id = jsonObject.getInteger("reportid");
        int userid = jsonObject.getInteger("userid");//举报用户
        String reason = jsonObject.getString("reason");
        UserMysql userMysql = new UserMysql();
        userMysql.setNum(userid);
        ReportInfoMysql reportInfoMysql = reportRepository.findByReportId(id);

        //已有人对该信息举报
        if(reportInfoMysql != null){
            //该信息已被管理员处理，但管理员拒绝删除，其他人在此举报则无效
            if(reportInfoMysql.isProcess()){
                return "举报成功";
            }
            List<UserMysql> userMysqls = reportInfoMysql.getUserMysqls();
            for (int i = 0; i < userMysqls.size(); i++) {
                //同一人直接返回
                if(userMysqls.get(i).getNum() == userid){
                    return "请勿多次举报";
                }
            }
            //不同人添加
            userMysqls.add(userMysql);
            reportInfoMysql.setUserMysqls(userMysqls);
            int count = reportInfoMysql.getCount();
            reportInfoMysql.setCount(++count);
            String str = reportInfoMysql.getReason()+";"+reason;
            reportInfoMysql.setReason(str);
            reportRepository.save(reportInfoMysql);
        }else{
            reportInfoMysql = new ReportInfoMysql();
            reportInfoMysql.setReportId(id);
            reportInfoMysql.setCount(1);
            reportInfoMysql.setProcess(false);
            reportInfoMysql.setOperator(0);
            reportInfoMysql.setReason(reason);
            List<UserMysql> userMysqls = new ArrayList<UserMysql>();
            userMysqls.add(userMysql);
            reportInfoMysql.setUserMysqls(userMysqls);
            reportRepository.save(reportInfoMysql);
        }
        return "举报成功";
    }
    public JSONArray getReport(){
        List<ReportInfoMysql> reports = reportRepository.findByProcessOrderByReportId(false);
        if (reports.size() == 0){
            return new JSONArray();
        }
        JSONArray jsonArray = new JSONArray();
        Set<Integer> ids = new HashSet<Integer>();
        for (int i = 0; i < reports.size(); i++) {
            ids.add(reports.get(i).getReportId());
        }
        List<InfoMysql> infos  = infoRepository.findidIn(ids);
        for (int i = 0; i < infos.size(); i++) {
            infos.get(i).getUser();
        }
        jsonArray.add(reports);
        jsonArray.add(infos);
        return jsonArray;
    }
    @Autowired
    private ReportCommentRepository reportCommentRepository;

    public String process(boolean decide, int id, int operator,String time, Channel channel){
        ReportInfoMysql reportInfoMysql = reportRepository.findByReportId(id);
        if(decide){
            reportInfoMysql.setProcess(true);
            reportInfoMysql.setOperator(operator);
            reportRepository.save(reportInfoMysql);
            InfoMysql infoMysql = infoRepository.findById(id).get();
            SystemInformMysql sim = new SystemInformMysql();
            new CommentThread("信息违规处理通知",infoMysql.getTheme(),2,
                    infoMysql.getUser().getOpenId(),reportInfoMysql.getReason(),id,sir,time,channel).putRequest();
            infoRepository.delete(infoMysql);
            return "删除成功";
        }else{
            reportInfoMysql.setProcess(true);
            reportInfoMysql.setOperator(operator);
            reportRepository.save(reportInfoMysql);
            return "操作成功";
        }
    }
}
