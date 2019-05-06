package com.example.lostandfind.lucene;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.InfoRepository;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.*;
import org.apache.lucene.search.highlight.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.wltea.analyzer.lucene.IKAnalyzer;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.*;
import java.util.*;

@Service
public class IndexLucene {

    @Autowired
    private InfoRepository infoRepository;

    private static Analyzer analyzer = new IKAnalyzer();

    private static String pic = "/Users/zhangcong/IdeaProjects/lostandfind/lucene";

    private static final int count = 10;
//  private static String pic = "/home/ubuntu/lostandfind/lucene";

    public void writeIndex(Document document){
        Directory directory = null;
        IndexWriterConfig indexWriterConfig = null;
        IndexWriter indexWriter = null;
        try {
            directory = FSDirectory.open(new File(pic));
            indexWriterConfig = new IndexWriterConfig(Version.LUCENE_47,analyzer);
            indexWriter = new IndexWriter(directory,indexWriterConfig);
            indexWriter.addDocument(document);
            indexWriter.commit();
            indexWriter.close();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    //搜索
    public List<InfoMysql> search(String value,int page) throws Exception{

        //索引库的存储目录
        Directory directory = FSDirectory.open(new File(pic));
        //读取索引库的存储目录
        DirectoryReader directoryReader = DirectoryReader.open(directory);
        //搜索类
        IndexSearcher indexSearcher = new IndexSearcher(directoryReader);
        //lucence查询解析器，用于指定查询的属性名和分词器
        QueryParser parser = new QueryParser(Version.LUCENE_47,"information", analyzer);
        //搜索
        Query query = parser.parse(value);
        //最终被分词后添加的前缀和后缀处理器，默认是粗体<B></B>
        SimpleHTMLFormatter htmlFormatter = new SimpleHTMLFormatter("<font color=red>","</font>");
        //高亮搜索的词添加到高亮处理器中
        Highlighter highlighter = new Highlighter(htmlFormatter, new QueryScorer(query));
        SortField sortField = new SortField("id",SortField.Type.INT,true);
        //获取搜索的结果，指定返回document返回的个数
        ScoreDoc[] hits = indexSearcher.search(query,10*page,new Sort(sortField)).scoreDocs;
        TopFieldDocs topFieldDocs = indexSearcher.search(query,10*page,new Sort(sortField));
        int size = topFieldDocs.totalHits;
        if(10*page-10 - size <= -10){
            return this.getId(10*page-10,10*page,topFieldDocs.scoreDocs,indexSearcher);
        }else if(10*page-10 - size < 0 && 10*page-10 - size > -10){
            return this.getId(10*page-10,size-10*page+10,topFieldDocs.scoreDocs,indexSearcher);
        }else{
            return new ArrayList<InfoMysql>();
        }
    }
    public List<InfoMysql> getId(int left,int right,ScoreDoc[] hits,IndexSearcher indexSearcher) throws Exception{
//        List<Integer> ids = new ArrayList<Integer>();
        Set<Integer> ids = new HashSet<>();
        for (int i = left; i < right; i++) {
            Document document = indexSearcher.doc(hits[i].doc);
            ids.add(Integer.parseInt(document.get("id")));
        }
        return search(ids);
    }
    public List<InfoMysql> search(Set<Integer> ids){
        return infoRepository.findidIn(ids);
    }
}
