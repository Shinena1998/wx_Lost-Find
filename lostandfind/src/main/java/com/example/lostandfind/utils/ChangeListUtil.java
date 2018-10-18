package com.example.lostandfind.utils;

/**
 * 因为不做相关查询工作
 * 把用户历史记录的字符数组转化为用+号作区分的字符串存入数据库
 * 取出数据是再做相关操作分开
 */
public class ChangeListUtil {
    private String[] historyList;
    private String[] indexList;
    public String changeHistoryListUtil(){
        int length = historyList.length;
        String history = historyList[0];
        for(int i = 1 ; i < length ; i++){
            history = history + "+" + historyList[i] ;
        }
        return history;
    }
    public String changeIndexListUtil(){
        int length = indexList.length;
        String index = indexList[0];
        for(int i = 1 ; i < length ; i++){
            index = index + "+" + indexList[i] ;
        }
        return index;
    }
    public ChangeListUtil(String[] historyList , String[] indexList){
        this.historyList = historyList;
        this.indexList = indexList;
    }
}
