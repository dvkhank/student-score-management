package com.ssm.services.impl;

import com.ssm.models.Activity;
import com.ssm.models.Participation;
import com.ssm.repositories.ActivityRepository;
import com.ssm.repositories.StudentRepository;
import com.ssm.services.ActivityService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ActivityServiceImpl implements ActivityService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private EntityManager entityManager;

    @Override
    public List<Activity> getAll() {
        return activityRepository.findAll();
    }

    @Override
    public void addOrUpdateActivity(Activity activity) {
        activityRepository.save(activity);
    }
    @Override
    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    @Override
    public void deleteActivityById(Long id) {
        activityRepository.deleteById(id);
    }
    @Override
    public List<Activity> getActivities(Map<String, String> params) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder(); //WHERE
        CriteriaQuery<Activity> query = cb.createQuery(Activity.class);
        Root<Activity> root = query.from(Activity.class); // TABLE
        List<Predicate> predicates = new ArrayList<>();//
        AtomicInteger page = new AtomicInteger(1);
        params.forEach((key, value) -> {
            switch (key) {
                case "keyword":
                    predicates.add(cb.like(root.get("name"), "%" + value + "%"));
                    break;
                case "startDate":
                    LocalDate startDate = LocalDate.parse(value, DateTimeFormatter.ISO_DATE);
                    predicates.add(cb.equal(root.get("startDate"), startDate));
                    break;
                case "activityKindId":
                    Long activityKindId = Long.valueOf(value);
                    predicates.add(cb.equal(root.get("activityKind").get("id"), activityKindId));
                    break;
                case "facultyId":
                    Long facultyId = Long.valueOf(value);
                    predicates.add(cb.equal(root.get("faculty").get("id"), facultyId));
                    break;
                case "periodId":
                    Long periodId = Long.valueOf(value);
                    predicates.add(cb.equal(root.get("period").get("id"), periodId));
                    break;
                case "money":
                    Integer money = Integer.valueOf(value);
                    predicates.add(cb.equal(root.get("money"), money));
                    break;
                case "page":
                     page.set(Integer.valueOf(params.get("page")));
                default:
                    // Handle unknown parameters if necessary
                    break;

            }
        });
        query.where(predicates.toArray(new Predicate[0]));
        int size =5;
        int firstPage = (page.get() - 1)*size;
        return entityManager.createQuery(query).setFirstResult(firstPage).setMaxResults(size).getResultList();
    }

    @Override
    public List<Activity> getActivitiesByStudent(Map<String, String> params) {
        // Lấy studentId từ params, nếu có
        String userIdParam = params.get("userId").trim();
        Long studentId = userIdParam != null ? studentRepository.findByUser_Id(Long.valueOf(userIdParam)).getId() : null;
        CriteriaBuilder cb = entityManager.getCriteriaBuilder(); //WHERE
        CriteriaQuery<Activity> query = cb.createQuery(Activity.class);
        Root<Activity> root = query.from(Activity.class); // TABLE
        List<Predicate> predicates = new ArrayList<>();//
        AtomicInteger page = new AtomicInteger(1);
        params.forEach((key, value) -> {
            switch (key) {
                case "keyword":
                    predicates.add(cb.like(root.get("name"), "%" + value + "%"));
                    break;
                case "startDate":
                    LocalDate startDate = LocalDate.parse(value, DateTimeFormatter.ISO_DATE);
                    predicates.add(cb.equal(root.get("startDate"), startDate));
                    break;
                case "activityKindId":
                    Long activityKindId = Long.valueOf(value);
                    predicates.add(cb.equal(root.get("activityKind").get("id"), activityKindId));
                    break;
                case "facultyId":
                    Long facultyId = Long.valueOf(value);
                    predicates.add(cb.equal(root.get("faculty").get("id"), facultyId));
                    break;
                case "periodId":
                    Long periodId = Long.valueOf(value);
                    predicates.add(cb.equal(root.get("period").get("id"), periodId));
                    break;
                case "money":
                    Integer money = Integer.valueOf(value);
                    predicates.add(cb.equal(root.get("money"), money));
                    break;
                case "page":
                    page.set(Integer.valueOf(params.get("page")));
                default:
                    // Handle unknown parameters if necessary
                    break;

            }
        });

        if (studentId != null) {
            // Join với bảng Participation để loại bỏ các hoạt động mà sinh viên đã tham gia
            Subquery<Long> subquery = query.subquery(Long.class);
            Root<Participation> participationRoot = subquery.from(Participation.class);
            subquery.select(participationRoot.get("id").get("activityId"));  // Sử dụng "id" để ánh xạ đến ParticipationId
            subquery.where(cb.equal(participationRoot.get("id").get("studentId"), studentId));

            Predicate activityNotParticipated = cb.not(root.get("id").in(subquery));
            predicates.add(activityNotParticipated);
        }

        query.where(predicates.toArray(new Predicate[0]));
        int size =5;
        int firstPage = (page.get() - 1)*size;
        return entityManager.createQuery(query).setFirstResult(firstPage).setMaxResults(size).getResultList();
    }
}
