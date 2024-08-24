package com.ssm.controllers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.ssm.JwtTokenProvider;
import com.ssm.models.Student;
import com.ssm.models.User;
import com.ssm.repositories.UserRepository;
import com.ssm.services.StudentService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class ApiLogin {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private StudentService studentService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        try {
            // Quá trình xác thực
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

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
            String id = claims.get("id", String.class);
            String firstName = claims.get("firstName", String.class);
            String lastName = claims.get("lastName", String.class);
            String avatar = claims.get("avatar", String.class);
            String role = claims.get("role", String.class);
            String email = claims.get("email", String.class);
            // Tạo đối tượng phản hồi với thông tin người dùng
            Map<String, Object> response = new HashMap<>();
            response.put("id", id);
            response.put("firstName", firstName);
            response.put("lastName", lastName);
            response.put("avatar", avatar);
            response.put("role", role);
            response.put("email", email);

            //IF Role la Sinh vien
            if (role.equals("student")) {
                Student st = studentService.getStudentByUserId(Long.valueOf(id));

                response.put("class", st.getClassField().getName());
                response.put("startYear", st.getClassField().getStartYear());
                response.put("faculty", st.getClassField().getFaculty().getName());
            }

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }


    @GetMapping("/googleTokenInfo")
    public ResponseEntity<?> getGoogleTokenInfo(@RequestHeader("Authorization") String token) {
        // Xóa bỏ prefix "Bearer " nếu có
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList("984920663519-3toq3our7t7o1ksjkjtshb33vdrptd03.apps.googleusercontent.com")) // Thay YOUR_CLIENT_ID bằng Client ID của bạn
                .setIssuer("https://accounts.google.com") // Xác minh Issuer là Google
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String userId = payload.getSubject();
                String email = payload.getEmail();
                User user = userRepository.findByEmail(email);
                // Tạo đối tượng phản hồi với thông tin người dùng
                Map<String, Object> response = new HashMap<>();
                response.put("userId", userId);
                response.put("email", email);
                response.put("avatar", user.getAvatar());
                response.put("lastName", user.getLastname());
                response.put("firstName", user.getFirstname());
                if(user.getRole().equals("student")) {
                    Student student = studentService.getStudentByUserId(Long.valueOf(user.getId()));
                    response.put("class", student.getClassField().getName());
                    response.put("startYear", student.getClassField().getStartYear());
                    response.put("faculty", student.getClassField().getFaculty().getName());
                    response.put("role", "student");
                }
                else {
                    response.put("role", "admin");
                }
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid ID token");
            }
        } catch (GeneralSecurityException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying token");
        }
    }




}
