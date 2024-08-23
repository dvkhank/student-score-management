package com.ssm.services.impl;

import com.ssm.dto.request.ParticipationCreation;
import com.ssm.models.Participation;
import com.ssm.models.ParticipationId;
import com.ssm.models.Student;
import com.ssm.repositories.ActivityRepository;
import com.ssm.repositories.ParticipationRepository;
import com.ssm.repositories.StudentRepository;
import com.ssm.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        participation.setId(participationId);
        participation.setActivity(activityRepository.getOne(participationCreation.getActivityId()));
        participation.setStudent(student);
        participation.setParcipatedDate(participationCreation.getParcipatedDate());
        participation.setRequest(participationCreation.getRequest());
        participation.setDescription(participationCreation.getDescription());
        participation.setEvidence(participationCreation.getEvidence());
        participationRepository.save(participation);
    }
}
