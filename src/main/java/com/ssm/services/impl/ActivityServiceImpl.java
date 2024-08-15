package com.ssm.services.impl;

import com.ssm.models.Activity;
import com.ssm.repositories.ActivityRepository;
import com.ssm.services.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
}
