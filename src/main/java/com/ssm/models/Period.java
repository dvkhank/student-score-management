package com.ssm.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "periods")
public class Period {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "year")
    private Integer year;

    @OneToMany(mappedBy = "period")
    @JsonIgnore // Ngăn vòng lặp JSON ở đây
    private Set<Activity> activities = new LinkedHashSet<>();

}