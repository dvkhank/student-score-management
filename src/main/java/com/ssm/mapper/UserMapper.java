package com.ssm.mapper;

import com.ssm.dto.request.UserCreationRequest;
import com.ssm.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest user);
}
