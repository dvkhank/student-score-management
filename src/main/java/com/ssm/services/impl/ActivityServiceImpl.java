package com.ssm.services.impl;

import com.ssm.models.Activity;
import com.ssm.repositories.ActivityRepository;
import com.ssm.services.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

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
        if(params.containsKey("kw")) {
            return activityRepository.findByKeyword(params.get("kw"));
        }
        return activityRepository.findAll();
    }
}
