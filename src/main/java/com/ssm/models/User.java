package com.ssm.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 120)
    @Column(name = "firstname", length = 120)
    private String firstname;

    @Size(max = 120)
    @Column(name = "lastname", length = 120)
    private String lastname;

    @Size(max = 120)
    @Column(name = "username", length = 120)
    private String username;

    @Size(max = 200)
    @Column(name = "password", length = 200)
    private String password;

    @Size(max = 120)
    @Column(name = "avatar", length = 120)
    private String avatar;

    @Size(max = 10)
    @Column(name = "role", length = 10)
    private String role;

    @Size(max = 200)
    @Column(name = "email", length = 200)
    private String email;

    @OneToMany(mappedBy = "user")
    @JsonIgnore // Ngăn vòng lặp JSON ở đây
    private Set<Student> students = new LinkedHashSet<>();

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