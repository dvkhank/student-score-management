package com.ssm.controllers;

import com.ssm.dto.request.ParticipationCreation;
import com.ssm.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiParticipation {
    @Autowired
    private ParticipationService participationService;
    @PostMapping("/participation")
    public ResponseEntity<?> saveParticipation(@RequestBody ParticipationCreation participationCreation) {
        participationService.addOrUpdateActivity(participationCreation);
        return ResponseEntity.ok().build();
    }
}
