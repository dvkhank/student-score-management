package com.ssm.configs;

import com.cloudinary.Cloudinary;
import com.ssm.security.JwtAuthenticationFilter;
import com.ssm.services.impl.CustomUserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomUserDetailService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Vô hiệu hóa CSRF
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Chính sách phiên không trạng thái
                )
                .authorizeHttpRequests(authz ->
                        authz
                                .requestMatchers("/api/student/**").hasAuthority("student")
                                .requestMatchers("/api/periods","/api/kinds","/api/faculties").permitAll()
                                .requestMatchers("/api/userinfo/", "/api/userInfoEmail","/api/login").permitAll()
//                                .requestMatchers("/", "/api/**").permitAll() // Cho phép truy cập không yêu cầu xác thực
                                .requestMatchers("/api/admin/**").hasAuthority("admin")
                                .anyRequest().authenticated() // Các yêu cầu khác yêu cầu xác thực
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public Cloudinary cloudinary() {
        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", "dfs6qhtdp");
        config.put("api_key", "783287636326811");
        config.put("api_secret", "I5yF-_c9P7bfo4rLhwoolpZ6kUE");
        config.put("secure", true);
        return new Cloudinary(config);
    }
}
