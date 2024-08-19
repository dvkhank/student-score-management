package com.ssm.dto.request;

import lombok.Data;

@Data
public class UserCreationRequest {
    private Long id;

    private String firstname;

    private String lastname;

    private String username;

    private String password;

    private String avatar;

    private String role;
}
