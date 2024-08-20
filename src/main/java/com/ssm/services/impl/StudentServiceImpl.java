package com.ssm.services.impl;

import com.ssm.models.Student;
import com.ssm.repositories.StudentRepository;
import com.ssm.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public Student getStudentByUserId(Long id) {
        return studentRepository.findByUser_Id(id);
    }
}
