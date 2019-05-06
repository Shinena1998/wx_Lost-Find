package com.example.lostandfind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.lostandfind.domain.Result;
import com.example.lostandfind.mysql.CommentMysql;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.CommentRespository;
import com.example.lostandfind.repository.InfoRepository;
import com.example.lostandfind.utils.ResultUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class CommentService {
    //获得某条信息下的评论
    @Autowired
    private CommentRespository commentRespository;
    @Transactional
    public JSONArray getComments(int id){
//        String[] idString = ids.split(",");
//        List<Integer> idi = new ArrayList<Integer>();
//        for (int i = 0; i < idString.length ; i++) {
//            idi.add(Integer.parseInt(idString[i]));
//        }
        InfoMysql infoMysql = new InfoMysql();
        infoMysql.setId(id);
        List<CommentMysql> comments = commentRespository.findByInfoOrderByIdDesc(infoMysql);
        return getLazyData(comments,false);
    }
    //获得某个用户的评论
    @Transactional
    public JSONObject getPersonComments(String openid){
        //得到发布下信息下所有回复
        System.out.println(openid);
        List<CommentMysql> comments = commentRespository.findByIdentityOrderByIdDesc(openid);
        int view = 0 , to_view = 0;
        for (int i = comments.size()-1; i >= 0; i--) {
            if(!comments.get(i).isView()){
                //删除在发布者物品信息下回复发布者的消息，并且发布者还没看
                if (comments.get(i).getIdentity().equals(comments.get(i).getToUid())
                        && !comments.get(i).isToView()){
                    comments.remove(i);
                }else {
                    view++;
                }
            }else{
                break;
            }
        }
        JSONArray commentJa = new JSONArray();
        if(comments.size()>0){
            commentJa = getLazyData(comments,true);
        }
        //回复评论
        List<CommentMysql> reply = commentRespository.findByToUidOrderByIdDesc(openid);
        for (int i = reply.size()-1; i >= 0; i--) {
            if (!reply.get(i).isToView()){
                to_view++;
            }else {
                break;
            }
        }
        JSONArray replyJz = new JSONArray();
        if(reply.size()>0){
            replyJz = getLazyData(reply,true);
        }
        JSONObject jsonObject  = new JSONObject();
        jsonObject.put("info",commentJa);
        jsonObject.put("infoNum",view);
        jsonObject.put("reply",replyJz);
        jsonObject.put("replyNum",to_view);
        return jsonObject;
    }
    //获得懒加载数据
    public JSONArray getLazyData(List<CommentMysql> comments,boolean showInfo){
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < comments.size(); i++) {
            comments.get(i).getUser().getAvatarUrl();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("commentInfo",comments.get(i));
            jsonObject.put("userInfo",comments.get(i).getUser());
            if(showInfo){
                comments.get(i).getInfo().getIdentity();
                jsonObject.put("dataInfo",comments.get(i).getInfo());
            }
            jsonArray.add(jsonObject);

        }
        return jsonArray;
    }
    @Transactional
    public Result changeRead(int kind , int num , String openid){
        if(kind == 0) {
            List<CommentMysql> reply = commentRespository.findByToUidAndToViewOrderByIdDesc(openid,false);
            for (int i = 0; i < reply.size() ; i++) {
                reply.get(i).setToView(true);
                commentRespository.save(reply.get(i));
            }
        }else if(kind == 1){
            List<CommentMysql> about = commentRespository.findByIdentityAndViewOrderByIdDesc(openid,false);
            for (int i = 0; i < about.size(); i++) {
                about.get(i).setView(true);
                commentRespository.save(about.get(i));
            }
        }
        return ResultUtil.success();
    }
}
