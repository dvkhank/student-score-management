package com.ssm.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "participation")
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

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "evidence", length = 200)
    private String evidence;

}