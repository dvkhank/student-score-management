package com.ssm.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "activity_kind")
@Data
public class ActivityKind {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String description;
    private int maxScore;

    @ColumnDefault("0")
    private int minScore;
}