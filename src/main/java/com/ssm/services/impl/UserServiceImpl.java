package com.ssm.services.impl;

import com.ssm.dto.request.UserCreationRequest;
import com.ssm.mapper.UserMapper;
import com.ssm.models.User;
import com.ssm.repositories.UserRepository;
import com.ssm.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    public User createUser(UserCreationRequest user) {
        if(userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("username already exists");
        }
        User newUser = userMapper.toUser(user);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        return userRepository.save(newUser);
    }


}
