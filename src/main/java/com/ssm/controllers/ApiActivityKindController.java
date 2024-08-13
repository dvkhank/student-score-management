package com.ssm.controllers;

import com.ssm.models.ActivityKind;
import com.ssm.services.ActivityKindService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiActivityKindController {
    @Autowired
    private ActivityKindService activityKindService;
    @GetMapping("/kinds")
    public List<ActivityKind> getAllActivityKind(){
        return activityKindService.getAll();
    }

}
