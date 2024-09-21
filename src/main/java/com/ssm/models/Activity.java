package com.ssm.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "activities")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100)
    @Column(name = "name", length = 100)
    private String name;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 100)
    @Column(name = "description", length = 100)
    private String description;

    @NotNull(message = "Start date cannot be null")
    @Column(name = "start_date")
    private LocalDate startDate;

    @Min(value = 1, message = "Score must be at least 1")
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

    @OneToMany(mappedBy = "activity")
    @JsonIgnore // Ngăn vòng lặp JSON ở đây
    private Set<com.ssm.models.Participation> participations = new LinkedHashSet<>();

}