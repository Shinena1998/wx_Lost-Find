package com.example.lostandfind.repository;

import com.example.lostandfind.mysql.ReportInfoMysql;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<ReportInfoMysql, Integer> {
    @EntityGraph(value = "report.all" , type= EntityGraph.EntityGraphType.FETCH)
    public ReportInfoMysql findByReportId(int id);
    @EntityGraph(value = "report.all" , type= EntityGraph.EntityGraphType.FETCH)
    public List<ReportInfoMysql> findByProcessOrderByReportId(boolean b);
}
