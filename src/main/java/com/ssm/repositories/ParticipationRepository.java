package com.ssm.repositories;

import com.ssm.models.Activity;
import com.ssm.models.Participation;
import com.ssm.models.ParticipationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParticipationRepository extends JpaRepository<Participation, ParticipationId> {
    @Query("SELECT p.activity FROM Participation p WHERE p.id.studentId = :studentId AND p.active = false AND p.request = false AND p.activity.period.id = :periodId")
    List<Activity> getAllMissingActivities(@Param("studentId") Long studentId, @Param("periodId") Long periodId);

    @Query("SELECT p FROM Participation p WHERE p.active = false AND p.request = true AND p.activity.period.id = :periodId")
    List<Participation> getAllMissingActivitiesByAdmin(Long periodId);
}
