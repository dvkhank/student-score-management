package com.ssm.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "faculties")
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 50)
    @Column(name = "name", length = 50)
    private String name;

    @OneToMany(mappedBy = "faculty")
    @JsonIgnore // Ngăn vòng lặp JSON ở đây
    private Set<Activity> activities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "faculty")
    @JsonIgnore // Ngăn vòng lặp JSON ở đây
    private Set<Class> classes = new LinkedHashSet<>();

}