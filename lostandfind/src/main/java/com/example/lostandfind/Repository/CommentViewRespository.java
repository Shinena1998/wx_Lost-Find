package com.example.lostandfind.repository;

import com.example.lostandfind.view.CommentView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentViewRespository extends JpaRepository<CommentView,Integer> {
    public List<CommentView> findByInfoId(Integer infoId);
    public List<CommentView> findByIdentityOrderByIdAsc(String Identity);
    public List<CommentView> findByToUid(String Uid);
//    @Query(value = "update comment_view set view=true where id=?1 ",nativeQuery = true)
//    public void updateView(int id);
//    @Query(value = "update comment_view set to_view=1 where id=?1",nativeQuery = true)
//    public void updateToView(int id);
}
