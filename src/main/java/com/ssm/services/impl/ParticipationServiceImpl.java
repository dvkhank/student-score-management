package com.ssm.services.impl;

import com.ssm.dto.request.ParticipationCreation;
import com.ssm.models.Activity;
import com.ssm.models.Participation;
import com.ssm.models.ParticipationId;
import com.ssm.models.Student;
import com.ssm.repositories.ActivityRepository;
import com.ssm.repositories.ParticipationRepository;
import com.ssm.repositories.StudentRepository;
import com.ssm.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParticipationServiceImpl implements ParticipationService {
    @Autowired
    private ParticipationRepository participationRepository;

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ActivityRepository activityRepository;

    @Override
    public void addOrUpdateActivity(ParticipationCreation participationCreation) {
        System.out.println(participationCreation.getUserId());
        Student student = studentRepository.findByUser_Id(participationCreation.getUserId());


        ParticipationId participationId = new ParticipationId();
        participationId.setActivityId(participationCreation.getActivityId());
        participationId.setStudentId(student.getId());
        Participation participation = new Participation();
        participation.setActive(participationCreation.getActive());
        participation.setId(participationId);
        participation.setActivity(activityRepository.getOne(participationCreation.getActivityId()));
        participation.setStudent(student);
        participation.setParcipatedDate(participationCreation.getParcipatedDate());
        participation.setRequest(participationCreation.getRequest());
        participation.setDescription(participationCreation.getDescription());
        participation.setEvidence(participationCreation.getEvidence());
        participationRepository.save(participation);
    }

    @Override
    public List<Activity> getMissingActivity(Long userId,Long periodId) {
        Long studentId = studentRepository.findByUser_Id(userId).getId();
        return participationRepository.getAllMissingActivities(studentId, periodId);
    }

    @Override
    public List<Participation> getAllParticipation() {
        return participationRepository.findAll();
    }

    public Participation findParticipation(ParticipationId participationId) {
        return participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Participation not found"));
    }

    public List<Participation> getAllMissingActivitiesByAdmin(Long periodId) {
        return participationRepository.getAllMissingActivitiesByAdmin(periodId);
    }


}
