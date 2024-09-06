package com.ssm.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ParticipationCreation {
    private Long userId;
    private Long activityId;
    private LocalDate parcipatedDate;
    private Boolean request;
    private Boolean active;
    private String description;
    private String evidence;
}
