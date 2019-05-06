package com.example.lostandfind.repository;


import com.example.lostandfind.mysql.ReportCommentMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportCommentRepository extends JpaRepository<ReportCommentMysql,Integer> {
    public ReportCommentMysql findByReportId(int id);

    public List<ReportCommentMysql> findByProcessOrderByReportId(boolean b);

    @Query(value = "select COUNT(*) from reportcomment where process=false",nativeQuery = true)
    int commentCount();
}
