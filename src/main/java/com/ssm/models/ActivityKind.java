package com.ssm.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "activity_kinds")
public class ActivityKind {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "max_score")
    private Integer maxScore;

}