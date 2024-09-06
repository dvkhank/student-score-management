package com.ssm.services;

import com.ssm.models.Activity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ActivityService {
    List<Activity> getAll();
    void addOrUpdateActivity(Activity activity);
    public Optional<Activity> getActivityById(Long id);
    public void deleteActivityById(Long id);
    public List<Activity> getActivities(Map<String, String> params);
    public List<Activity> getActivitiesByStudent(Map<String, String> params);
}
