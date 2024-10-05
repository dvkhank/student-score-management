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

    @Query("SELECT k.id, k.description, k.maxScore, " +
            "CASE WHEN SUM(a.score) > k.maxScore THEN k.maxScore ELSE SUM(a.score) END AS totalScore " +
            "FROM Participation p " +
            "JOIN p.student st " +
            "JOIN p.activity a " +
            "JOIN a.period pe " +
            "JOIN a.activityKind k " +
            "WHERE st.id = :studentId AND pe.id = :periodId AND p.active = true " +
            "GROUP BY k.id " +
            "ORDER BY k.id")
    List<Object[]> getScoreByKind(@Param("studentId") Long studentId,@Param("periodId") Long periodId);

    @Query("SELECT a.name, a.score, k.id " +
            "FROM Participation p " +
            "JOIN p.student st " +
            "JOIN p.activity a " +
            "JOIN a.period pe " +
            "JOIN a.activityKind k " +
            "WHERE st.id = :studentId AND pe.id = :periodId and p.active = true " +
            "GROUP BY k.id, a.name, a.score")
    List<Object[]> getActivitiesByKind(@Param("studentId") Long studentId,@Param("periodId") Long periodId);

    @Query("SELECT st.id,f.name, k.id, " +
            "CASE WHEN SUM(a.score) > k.maxScore THEN k.maxScore ELSE SUM(a.score) END AS totalScore " +
            "FROM Participation p " +
            "JOIN p.student st " +
            "JOIN st.classField c " +
            "JOIN c.faculty f " +
            "JOIN p.activity a " +
            "JOIN a.period pe " +
            "JOIN a.activityKind k " +
            "WHERE pe.id = :periodId AND p.active = true " +
            "GROUP BY k.id, st.id")
    List<Object[]> SumScoreByFaculty(@Param("periodId") Long periodId);

    @Query("SELECT st.id,c.id, k.id, " +
            "CASE WHEN SUM(a.score) > k.maxScore THEN k.maxScore ELSE SUM(a.score) END AS totalScore " +
            "FROM Participation p " +
            "JOIN p.student st " +
            "JOIN st.classField c " +
            "JOIN c.faculty f " +
            "JOIN p.activity a " +
            "JOIN a.period pe " +
            "JOIN a.activityKind k " +
            "WHERE pe.id = :periodId AND p.active = true AND f.id = :facultyId " +
            "GROUP BY k.id, st.id ")
    List<Object[]> sumScoreByClass(@Param("periodId") Long periodId,@Param("facultyId") Long facultyId);

}
