package com.ssm.repo;

import com.ssm.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
@RepositoryRestResource
public interface UserRepository extends JpaRepository<User, Long> {
    @RestResource(path = "username")
    List<User> findAllByUsernameLikeIgnoreCase(@RequestParam(name = "name") String pattern);
}