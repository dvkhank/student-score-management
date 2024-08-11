package com.ssm.repo;

import com.ssm.models.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="classes")
public interface StudentClassRepository extends JpaRepository<Class, Long> {
}
