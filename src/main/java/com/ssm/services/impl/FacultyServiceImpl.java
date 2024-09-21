package com.ssm.services.impl;

import com.ssm.models.Faculty;
import com.ssm.repositories.FacultyRepository;
import com.ssm.services.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyServiceImpl implements FacultyService {
    @Autowired
    private FacultyRepository facultyRepository;

    @Cacheable(value = "faculties", key = "'faculties'") // Caching với key là id của user
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @Override
    public Faculty getFacultyByName(String name) {
        return facultyRepository.findByName(name);
    }

}
