package com.ssm.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "participation")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Participation {

    @EmbeddedId
    private ParticipationId id;

    @MapsId("studentId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private com.ssm.models.Student student;

    @MapsId("activityId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @Column(name = "parcipated_date")
    private LocalDate parcipatedDate;

    @ColumnDefault("0")
    @Column(name = "request")
    private Boolean request;

    @Size(max = 200)
    @Column(name = "description", length = 200)
    private String description;

    @Size(max = 200)
    @Column(name = "evidence", length = 200)
    private String evidence;

    @Column(name = "active")
    private Boolean active;

}