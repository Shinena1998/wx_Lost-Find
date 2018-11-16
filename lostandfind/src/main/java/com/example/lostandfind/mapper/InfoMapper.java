package com.example.lostandfind.mapper;

import com.example.lostandfind.mysql.InfoMysql;
import com.example.lostandfind.mysql.ManagerMysql;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface InfoMapper {
    /**
     * 分页查询数据
     * @return
     */
    Page<ManagerMysql> findByPage();
}
