package com.ssm.services.impl;

import com.ssm.models.Faculty;
import com.ssm.repositories.FacultyRepository;
import com.ssm.services.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyServiceImpl implements FacultyService {
    @Autowired
    private FacultyRepository facultyRepository;

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }
}
