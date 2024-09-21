package com.ssm.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "activity_kinds")
public class ActivityKind implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 200)
    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "max_score")
    private Integer maxScore;

    @OneToMany(mappedBy = "activityKind")
    @JsonIgnore // Ngăn vòng lặp JSON ở đây
    private Set<Activity> activities = new LinkedHashSet<>();

}