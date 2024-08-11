package com.ssm.repo;

import com.ssm.models.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="faculties")
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
}
