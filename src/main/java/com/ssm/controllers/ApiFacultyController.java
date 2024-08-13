package com.ssm.controllers;

import com.ssm.models.Faculty;
import com.ssm.services.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiFacultyController {
    @Autowired
    private FacultyService facultyService;
    @GetMapping("/faculties")
    public List<Faculty> getAllFaculties() {
        return facultyService.getAllFaculty();
    }
}
