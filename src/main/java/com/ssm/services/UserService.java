package com.ssm.services;

import com.ssm.dto.request.UserCreationRequest;
import com.ssm.models.User;

public interface UserService {
    public User createUser(UserCreationRequest userCreationRequest);
}
