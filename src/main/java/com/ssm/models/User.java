package com.ssm.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Data
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Hoặc GenerationType.AUTO
    private Long id;

    @Column(name = "firstname", length = 120)
    private String firstname;

    @Column(name = "lastname", length = 120)
    private String lastname;

    @Column(name = "username", length = 120)
    private String username;

    @Column(name = "password", length = 200)
    private String password;

    @Column(name = "avatar", length = 120)
    private String avatar;

    @Column(name = "role", length = 10)
    private String role;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(role));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}