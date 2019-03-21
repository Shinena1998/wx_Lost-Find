package com.example.lostandfind.service;

import com.example.lostandfind.domain.Result;
import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.InfoRepository;
import com.example.lostandfind.utils.ResultUtil;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import javax.transaction.Transactional;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class InfoService {
    public boolean hasError(InfoMysql infoMysql){
        if(infoMysql.isaBoolean() == false){
            if(infoMysql.getTime()== "" || infoMysql.getCategory() == ""
                    || infoMysql.getInfomation() == ""
                    || infoMysql.getPicPath() == "" || infoMysql.getPlace()== ""){
                return true;
            }else {
                return false;
            }
        }else {
            if(infoMysql.getTime()== "" || infoMysql.getCategory() == ""
                    || infoMysql.getInfomation() == ""
                    || infoMysql.getPicPath() == "" || infoMysql.getPlace()== ""
                    || infoMysql.getIdentity() == ""){
                return true;
            }else {
                return false;
            }
        }
    }

    //按照页数取出一般信息
    @Transactional
    public List<InfoMysql> pageInfo(int pageNum , InfoRepository infoRepository){
        int size = 200;
        int page = pageNum;
        Sort sort = new Sort(Sort.Direction.ASC,"id");
        Pageable pageable = PageRequest.of(page,size,sort);
        return infoRepository.findByIsValuable(false,pageable);
    }
    //上传物品信息
    @Transactional
    public Result writeInfo(InfoMysql infoMysql, InfoRepository infoRepository) throws ParseException {
        InfoService infoService = new InfoService();
        if (infoService.hasError(infoMysql)) {
            return ResultUtil.error(12, "填全内容");
        }
        infoMysql.setCount(0);
        infoMysql.setTimestamps((new Date().getTime())/1000);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        infoMysql.setLoststamp(simpleDateFormat.parse(infoMysql.getTime()).getTime()/1000 + 1000);
        infoRepository.save(infoMysql);
        return ResultUtil.success(infoMysql);
    }
    //管理员审核物品
    @Transactional
    public Result passValuable(int id, boolean confirm, InfoRepository infoRepository){
        InfoMysql infoMysql =  infoRepository.findById(id).get();
        if(confirm){
            infoMysql.setaBoolean(confirm);
        }else{
            infoMysql.setValuable(confirm);
        }
        infoRepository.save(infoMysql);
        return ResultUtil.success();
    }

    public int addCount(int id, InfoRepository infoRepository){
        InfoMysql infoMysql = infoRepository.findById(id).get();
        int count = infoMysql.getCount();
        infoMysql.setCount(++count);
        infoRepository.save(infoMysql);
        return count;
    }

    public boolean deleteInfo(int id, InfoRepository infoRepository){
        InfoMysql infoMysql = infoRepository.findById(id).get();
        infoRepository.delete(infoMysql);
        return true;
    }
}
