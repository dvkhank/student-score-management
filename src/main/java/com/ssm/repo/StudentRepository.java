package com.ssm.repo;

import com.ssm.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="students")
public interface StudentRepository extends JpaRepository<Student, Long> {
}
