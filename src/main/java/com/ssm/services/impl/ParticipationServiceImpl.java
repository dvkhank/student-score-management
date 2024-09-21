package com.ssm.services.impl;

import com.ssm.dto.request.ParticipationCreation;
import com.ssm.models.Activity;
import com.ssm.models.Participation;
import com.ssm.models.ParticipationId;
import com.ssm.models.Student;
import com.ssm.repositories.ActivityRepository;
import com.ssm.repositories.FacultyRepository;
import com.ssm.repositories.ParticipationRepository;
import com.ssm.repositories.StudentRepository;
import com.ssm.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ParticipationServiceImpl implements ParticipationService {
    @Autowired
    private ParticipationRepository participationRepository;

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private FacultyRepository facultyRepository;

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
    public List<Activity> getMissingActivity(Long userId, Long periodId) {
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

    public List<Object[]> getScoreByKind(Long studentId, Long periodId) {
        return participationRepository.getScoreByKind(studentId, periodId);
    }

    public List<Object[]> getActivitiesByKind(Long studentId, Long periodId) {
        return participationRepository.getActivitiesByKind(studentId, periodId);
    }

    @Cacheable(value = "sumScoreCache", key = "'periodId=' + #periodId + ',achievement=' + #achievement")
    @Override
    public List<Object[]> SumScore(Long periodId, String achievement) {
        int min = 0, max = 0;
        switch (achievement) {
            case "excellent" -> {
                min = 90;
                max = 100;
            }
            case "verygood" -> {
                min = 80;
                max = 89;
            }
            case "good" -> {
                min = 65;
                max = 79;
            }
            case "average" -> {
                min = 50;
                max = 64;
            }
            case "belowaverage" -> {
                min = 35;
                max = 49;
            }
            case "weak" -> {
                min = 0;
                max = 34;
            }
        }

        List<Object[]> result = participationRepository.SumScoreByFaculty(periodId);

        Map<Long, Integer> scoreMap = new HashMap<>();
        for (Object[] row : result) {
            Long key = (Long) row[0];
            Integer score = (Integer) row[3];
            scoreMap.put(key, scoreMap.getOrDefault(key, 0) + score);
        }

        Map<String, Integer> finalResult = new HashMap<>();
        for (Map.Entry<Long, Integer> entry : scoreMap.entrySet()) {
            Long studentId = entry.getKey();
            Integer score = entry.getValue();
            if (score >= min && score <= max) {
                String key = studentRepository.findById(studentId).get().getClassField().getFaculty().getName();
                finalResult.put(key, finalResult.getOrDefault(key, 0) + 1);
            }
        }
        List<Object[]> groupedResult = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : finalResult.entrySet()) {
            groupedResult.add(new Object[]{entry.getKey(), entry.getValue()});
        }

        return groupedResult;

    }


    @Cacheable(value = "sumScoreByClassCache", key = "'periodId=' + #periodId + ',facultyId=' + #facultyId + ',achievement=' + #achievement")
    @Override
    public List<Object[]> sumScoreByClass(Long periodId, Long facultyId, String achievement) {
        List<Object[]> temptResult = participationRepository.sumScoreByClass(periodId, facultyId);
        int min = 0;
        int max = 0;

        switch (achievement) {
            case "excellent" -> {
                min = 90;
                max = 100;
            }
            case "verygood" -> {
                min = 80;
                max = 89;
            }
            case "good" -> {
                min = 65;
                max = 79;
            }
            case "average" -> {
                min = 50;
                max = 64;
            }
            case "belowaverage" -> {
                min = 35;
                max = 49;
            }
            case "weak" -> {
                min = 0;
                max = 34;
            }
        }

        Map<Long, Integer> scoreMap = new HashMap<>();
        for (Object[] row : temptResult) {
            Long key = (Long) row[0];
            Integer score = (Integer) row[3];
            scoreMap.put(key, scoreMap.getOrDefault(key, 0) + score);
        }
        //Da co Loai MSSV : DiemTong
        Map<String, Integer> finalResult = new HashMap<>();
        for (Map.Entry<Long, Integer> entry : scoreMap.entrySet()) {
            String key = studentRepository.findById(entry.getKey()).get().getClassField().getName();
            if (entry.getValue() >= min && entry.getValue() <= max) {
                finalResult.put(key, finalResult.getOrDefault(key, 0) + 1);
            }
        }
        List<Object[]> finalGroupedResult = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : finalResult.entrySet()) {
            finalGroupedResult.add(new Object[]{entry.getKey(), entry.getValue()});
        }
        return finalGroupedResult;
    }


}
