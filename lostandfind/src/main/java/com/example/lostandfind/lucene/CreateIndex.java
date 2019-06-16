package com.example.lostandfind.lucene;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.InfoRepository;
import com.example.lostandfind.service.InfoService;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CreateIndex {
    @Autowired
    private InfoRepository infoRepository;
    @Autowired
    private IndexLucene indexLucene;

    public String CreateIndex(List<InfoMysql> infos){
        //查询数据库，必须要批量查询
        long fc = infoRepository.count();//查询总行数
        //获取字段
        for(int i=0;i<infos.size();i++){
            //获取每行数据
            //创建Document对象
            Document doc = new Document();
            //获取每列数据
            String content = infos.get(i).getTheme() + infos.get(i).getInfomation();//将信息标题和内容分词
            Field id = new StringField("id" , infos.get(i).getId().toString(),Field.Store.YES);
            TextField theme = new TextField("content",content, Field.Store.YES);//存储分词
            //添加到Document中
            doc.add(id);
            doc.add(theme);
            //调用，创建索引库
            indexLucene.writeIndex(doc);
        }
        return "successful";
    }
    public String getLafInfo(){
        List<InfoMysql> infos = infoRepository.findAll();
        return this.CreateIndex(infos);
    }
    public List<InfoMysql> getInfo(String keyWord,int page) throws Exception{
        return indexLucene.search(keyWord,page);
    }
}
