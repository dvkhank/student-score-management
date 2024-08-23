package com.ssm;

import com.ssm.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private Long jwtExpirationInMs = 3600000L;
    private final SecretKey secretKey;

    public JwtTokenProvider() {
        // Tạo khóa bí mật cho HS512
        this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    }


    public String generateToken(Authentication authentication) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = (User) userDetails; // Chuyển đổi thành User nếu cần thông tin bổ sung

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("id", user.getId().toString())
                .claim("firstName", user.getFirstname()) // Thêm thông tin bổ sung vào token
                .claim("lastName", user.getLastname()) // Thêm thông tin bổ sung vào token
                .claim("avatar", user.getAvatar())
                .claim("role", user.getRole()) // Thêm quyền vào token
                .claim("email",user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, secretKey)
                .compact();
    }
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(authToken);
            return true;
        } catch (Exception ex) {
            // Handle different exceptions for different types of JWT errors
        }
        return false;
    }

    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


}
