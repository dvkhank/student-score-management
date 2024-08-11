package com.ssm.repo;

import com.ssm.models.ActivityKind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="activity_kinds")
public interface ActivityKindRepository extends JpaRepository<ActivityKind, Long> {
}
