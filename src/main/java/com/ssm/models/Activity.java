package com.ssm.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Column(name = "name", length = 100)
    private String name;

    @NotBlank(message = "Description cannot be blank")
    @Column(name = "description", length = 100)
    private String description;

    @NotNull(message = "Start date cannot be null")
    @Column(name = "start_date")
    private LocalDate startDate;

    @Min(value = 1, message = "Score must be at least 1")
    @NotNull(message = "Score cannot be null")
    @Column(name = "score")
    private Integer score;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "activity_kind_id")
    private com.ssm.models.ActivityKind activityKind;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "faculty_id")
    private com.ssm.models.Faculty faculty;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "period_id")
    private com.ssm.models.Period period;

    @Column(name = "money")
    private Integer money;

}