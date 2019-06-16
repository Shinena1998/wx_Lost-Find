package com.example.lostandfind.utils;


import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.repository.InfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.*;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class DivideWord {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    //关键词集合
    @Resource(name = "labelWord")
    private List<String> labelWord;
    //推荐搜索集合
    @Resource(name = "pushWord")
    private List<String> searchWord;
    //使用推荐搜索表进行匹配
    public void divideWord(String info){
        for (int i = 0; i < searchWord.size(); i++) {
            if(Pattern.matches(searchWord.get(i),info)){
                this.add(searchWord.get(i));
            }
        }
    }
    //使用redis的ZSet类型进行排序
    public void add(String element){
        stringRedisTemplate.opsForZSet().incrementScore("search",element,1.0);
    }
    //添加信息。每天凌晨进行搜索关键词排名
    public void addInfo(String info){
        stringRedisTemplate.opsForList().leftPush("infos",info);
    }
    public void search() {
        System.out.println(searchWord);
        String[] str =  {"耳机耳塞式 白色耳机。大概在金花食堂到图书馆的路上丢的","姓名:付佳鑫学号:3170511034学院:经济与管理学院班级:管172",
        "马原小册子","水杯教八215丢失，粉色特百惠","耳机在教十318丢了一个beats耳机 如图 希望有人能捡到联系 ","眼镜男生澡堂079有副眼镜 ","雨伞有没有哪位小可爱昨天下午在金花校区捡到或者看到一把暖沙色的胶囊伞～如果看到的话麻烦告诉我一声，谢谢",
                "小西，我的红色蓝牙耳机今天中午在金花二楼餐厅弄丢了，麻烦捡到的同学联系蓝牙耳机","小西，麻烦问一下这是谁的，和我联系四级准考证","小西，求助，我昨晚上在教10-315丢了一副蓝牙耳机是白色的盒子，魅族的。请看到的同学联系  耳机",
        "是一个nike的花球 5.24康师傅3v3篮球赛在曲江教学区篮球场 那天人比较多 可能是谁拿去投了 最后也没有找到 是7号球 麻烦谁拿错了找一找吧 谢谢\uD83D\uDE4F篮球","我枯了\n" +
                "我表丢了...\n" +
                "应该是在女生浴室2号隔间\n" +
                "有看见的小可爱可以联系我吗我真的要哭了\n" +
                "我初中的表啊\n" +
                "谢谢！！！手表","小西，麻烦找一下这位小姐姐，她的毕设设计日志。在教六504最后边那个窗子的窗台。毕设日志","教十303，在倒数第二排的抽屉笔袋",
                "姓名:李星\n" +
                        "学号:3180131040\n" +
                        "学院:材料科学与工程学院\n" +
                        "班级:材物182\n一卡通","姓名刘旭\n" +
                "入党材料（申请书，思想报告，证明材料）丢失\n" +
                "如果有捡到的好心人，请联系我\n" +
                "蟹蟹各位\u0014/磕头一卡通","哪位同学朋友在曲江泳池更衣室错拿了一双黑色高帮匡威70s呀？ 大约36半的码，昨天6月11日下午4点半左右游完泳忘记拿了，里面还塞了我的豆绿色袜子，在板凳底下。鞋子也不是新鞋，后面黑标也有磨损。鞋",
                "在教九326门口丢了一双 毒蜂2球鞋 如图 希望有人能捡到联系 鞋","教八315捡到一本音乐鉴赏的书 失主讲台自取 书",
        "教八314座位上有把伞雨伞","在教八414第三排看到的黑色衣服 不知道是谁的 自取 中间第三排抽屉里 衣服","在教十219靠右边的座位大概前四排丢了一个白色的笔袋，请有捡到的同学联系一下我\u0014/泪奔笔袋"};
        for (int i = 0; i < str.length; i++) {
            this.divideWord(str[i]);
        }
        //获取分数值从大到小的前10位值0-9
        Set index = stringRedisTemplate.opsForZSet().reverseRange("search",0,9);
        //更新排名内容
        this.updateIndex(index);
    }
    //更新最新排名
    public void updateIndex(Set index){
        //删除就排名内容
        if(stringRedisTemplate.hasKey("pushIndex")){
            stringRedisTemplate.delete("pushIndex");
        }
        String[] str = new String[10];
        int i = 0;
        Iterator iterator =  index.iterator();
        while (iterator.hasNext()){
           String word = (String) iterator.next();
           //因为关键词为了匹配，存的格式为.*xx.*,所以先取两位之后的字符串，在使用.切分字符串
           str[i++] = word.substring(2).split("\\.")[0];
        }
        stringRedisTemplate.opsForSet().add("pushIndex",str);
        System.out.println(stringRedisTemplate.opsForSet().members("pushIndex"));
    }
    //获得失物信息关键词,返回一个字符串，用+号分割关键词
    public String getKeyWord(String info){
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < labelWord.size(); i++) {
            //其实这里没必要使用正则表达式，直接使用String.indexof()即可
            if(Pattern.matches(labelWord.get(i),info)){
                if(labelWord.get(i).equals(".*书.*")){
                    //长短关键词重叠
                    if(!this.conflict(info,"书","图书馆")){
                        continue;
                    }
                }
                //因为关键词为了匹配，存的格式为.*xx.*,所以先取两位之后的字符串，在使用.切分字符串
                String str = labelWord.get(i).substring(2).split("\\.")[0];
                sb.append(str+"+");
            }
        }
        return sb.toString();
    }
    //因为类似图书馆和书这种匹配冲突，所以进行排查
    //冲突关键词长的必定包含短的比如图书馆，书
    public boolean conflict(String info,String shortWord,String longWord){
        int longL = info.indexOf(longWord);
        //在长关键词后面是否出现
        int shortAfter = info.indexOf(shortWord,longL+longWord.length());
        //在长关键词前面是够出现
        int shortBefore = info.lastIndexOf(shortWord,longL);
        //任意一方存在即认为二者都有
        if((shortAfter != -1) || (shortBefore != -1)){
            return true;
        }else {
            return false;
        }
    }
    @Autowired
    private InfoRepository infoRepository;
    //获得以前的信息的关键词
    public List<String> getAllKey(){
        List<InfoMysql> infos = infoRepository.findAll();
        for (int i = 0; i < infos.size(); i++) {
            infos.get(i).setKeyWord(this.getKeyWord(infos.get(i).getTheme()+infos.get(i).getInfomation()));
        }
        infoRepository.saveAll(infos);
        return labelWord;
    }


}
