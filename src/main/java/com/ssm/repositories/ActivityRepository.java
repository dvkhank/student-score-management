package com.ssm.repositories;

import com.ssm.models.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findAll();

    @Query("SELECT a FROM Activity a WHERE LOWER(a.name) LIKE %:kw% ")
    List<Activity> findByKeyword(@Param("kw") String keyword);
}
