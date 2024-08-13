package com.ssm.controllers;

import com.ssm.models.Period;
import com.ssm.services.PeriodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiPeriodController {
    @Autowired
    private PeriodService periodService;
    @GetMapping("/periods")
    public List<Period> getPeriods() {
        return periodService.getAllPeriod();
    }
}
