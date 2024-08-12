package com.ssm.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "periods")
public class Period {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "semester")
    private Integer semester;

    @Column(name = "year")
    private Integer year;

}