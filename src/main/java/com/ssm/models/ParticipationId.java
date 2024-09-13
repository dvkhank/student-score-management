package com.ssm.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class ParticipationId implements java.io.Serializable {
    private static final long serialVersionUID = -2393039559739779767L;
    @NotNull
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @NotNull
    @Column(name = "activity_id", nullable = false)
    private Long activityId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ParticipationId entity = (ParticipationId) o;
        return Objects.equals(this.studentId, entity.studentId) &&
                Objects.equals(this.activityId, entity.activityId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, activityId);
    }

}