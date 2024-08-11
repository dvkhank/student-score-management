package com.ssm.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id", nullable = false)
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

}