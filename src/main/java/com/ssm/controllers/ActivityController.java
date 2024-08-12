package com.ssm.controllers;

import com.ssm.models.Activity;
import com.ssm.services.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ActivityController {
    @Autowired
    private ActivityService activityService;

    @GetMapping("/activities")
    public List<Activity> getActivities() {
        return activityService.findAll();
    }
}
