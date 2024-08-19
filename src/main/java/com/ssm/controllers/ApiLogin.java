package com.ssm.controllers;

import com.ssm.JwtTokenProvider;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class ApiLogin {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        try {
            // Quá trình xác thực
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            // Nếu xác thực thành công, tạo JWT token
            String token = jwtTokenProvider.generateToken(authentication);
            return "Bearer " + token;

        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid login credentials");
        }
    }
    @GetMapping("/userinfo")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        // Xóa bỏ prefix "Bearer " nếu có
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (jwtTokenProvider.validateToken(token)) {
            Claims claims = jwtTokenProvider.getClaimsFromToken(token);
            String firstName = claims.get("firstName", String.class);
            String lastName = claims.get("lastName", String.class);
            String email = claims.get("email", String.class);
            String avatar = claims.get("avatar", String.class);

            // Tạo đối tượng phản hồi với thông tin người dùng
            Map<String, Object> response = new HashMap<>();
            response.put("firstName", firstName);
            response.put("lastName", lastName);
            response.put("email", email);
            response.put("avatar", avatar);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
}
