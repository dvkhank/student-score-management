package com.ssm.repositories;

import com.ssm.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAll();
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    User findByEmail(String email);

}