package com.ssm.controllers;

import com.ssm.models.Activity;
import com.ssm.services.ActivityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ApiActivityController {
    @Autowired
    private ActivityService activityService;

    @GetMapping("/activities")
    public List<Activity> getActivities(@RequestParam Map<String, String> params) {
        return activityService.getActivities(params);
    }
    @GetMapping("/studentactivities")
    public List<Activity> getStudentActivities(@RequestParam Map<String, String> params) {
        return activityService.getActivitiesByStudent(params);
    }

    @PostMapping("/add-activity")
    public ResponseEntity addActivity(@Valid @RequestBody Activity activity, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(fieldError -> {
                errors.put(fieldError.getField(), fieldError.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }
        activityService.addOrUpdateActivity(activity);
        return ResponseEntity.ok("Activity created successfully");
    }

    @PutMapping("/activities/{id}")
    public ResponseEntity updateActivity(@PathVariable Long id, @Valid @RequestBody Activity activity, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(fieldError -> {
                errors.put(fieldError.getField(), fieldError.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }
        activity.setId(id);
        activityService.addOrUpdateActivity(activity);
        return ResponseEntity.ok("Activity updated successfully");
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity deleteActivity(@PathVariable Long id) {
        activityService.deleteActivityById(id);
        return ResponseEntity.ok("Activity deleted successfully");
    }

    @GetMapping("/activities/{id}")
    public Optional<Activity> getActivity(@PathVariable Long id) {
        return activityService.getActivityById(id);

    }
}
