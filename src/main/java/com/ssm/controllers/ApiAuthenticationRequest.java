package com.ssm.controllers;

import com.ssm.dto.request.AuthenticationRequest;
import com.ssm.services.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApiAuthenticationRequest {
    AuthenticationService authenticationService;
    @PostMapping("/login")
    boolean authenticationReponse(@RequestBody AuthenticationRequest request) {
        return authenticationService.authenticate(request);
    }
}
