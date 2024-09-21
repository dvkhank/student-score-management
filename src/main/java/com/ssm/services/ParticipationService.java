package com.ssm.services;

import com.ssm.dto.request.ParticipationCreation;
import com.ssm.models.Activity;
import com.ssm.models.Participation;
import com.ssm.models.ParticipationId;

import java.util.List;

public interface ParticipationService {
    public void addOrUpdateActivity(ParticipationCreation participationCreation);

    public List<Activity> getMissingActivity(Long userId, Long periodId);

    public List<Participation> getAllParticipation();

    public Participation findParticipation(ParticipationId participationId);

    public List<Participation> getAllMissingActivitiesByAdmin(Long periodId);

    public List<Object[]> getScoreByKind(Long studentId, Long periodId);

    List<Object[]> getActivitiesByKind(Long studentId, Long periodId);

    List<Object[]> SumScore(Long periodId,String achievement);
    List<Object[]> sumScoreByClass(Long periodId,Long facultyId, String achievement);
}
