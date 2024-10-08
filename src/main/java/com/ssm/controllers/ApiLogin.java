package com.ssm.controllers;

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


    @GetMapping("/userInfoEmail")
    public ResponseEntity<?> getUserInfoByEmail(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email);

            // Quá trình xác thực
            Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

            // Nếu xác thực thành công, tạo JWT token
            String token = jwtTokenProvider.generateToken(authentication);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            // Tạo đối tượng phản hồi với thông tin người dùng
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("email", email);
            response.put("avatar", user.getAvatar());
            response.put("lastName", user.getLastname());
            response.put("firstName", user.getFirstname());
            response.put("token", "Bearer " + token);

            if ("student".equals(user.getRole())) {
                Student student = studentService.getStudentByUserId(Long.valueOf(user.getId()));
                response.put("class", student.getClassField().getName());
                response.put("startYear", student.getClassField().getStartYear());
                response.put("faculty", student.getClassField().getFaculty().getName());
                response.put("role", "student");
                response.put("studentId", student.getId());
            } else {
                response.put("role", "admin");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing request");
        }
    }





}
