package com.ssm.controllers;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.ssm.dto.request.ParticipationCreation;
import com.ssm.models.Activity;
import com.ssm.models.Participation;
import com.ssm.models.ParticipationId;
import com.ssm.repositories.ParticipationRepository;
import com.ssm.repositories.StudentRepository;
import com.ssm.services.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiParticipation {
    @Autowired
    private ParticipationService participationService;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ParticipationRepository participationRepository;

    @PostMapping("/participation")
    public ResponseEntity<?> saveParticipation(@RequestBody ParticipationCreation participationCreation) {
        participationService.addOrUpdateActivity(participationCreation);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/missing-activities")
    public ResponseEntity<?> getMissingActivities(@RequestParam String userId, @RequestParam String periodId) {
        List<Activity> missingActivities = participationService.getMissingActivity(Long.valueOf(userId), Long.valueOf(periodId));
        return ResponseEntity.ok().body(missingActivities);
    }

    @PutMapping("/update-participation")
    public ResponseEntity<?> updateParticipation(
            @RequestPart("activityId") String activityId,
            @RequestPart("description") String description,
            @RequestPart("image") MultipartFile image,
            @RequestPart("userId") String userId) {

        try {
            Long studentId = studentRepository.findByUser_Id(Long.valueOf(userId)).getId();
            ParticipationId participationId = new ParticipationId();
            participationId.setStudentId(studentId);
            participationId.setActivityId(Long.valueOf(activityId));

            Participation participation = participationRepository.findById(participationId)
                    .orElseThrow(() -> new RuntimeException("Participation not found"));

            // Upload ảnh lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = (String) uploadResult.get("url");

            // Cập nhật đối tượng
            participation.setDescription(description);
            participation.setEvidence(imageUrl);
            participation.setRequest(true);
            participationRepository.save(participation);

            return ResponseEntity.ok("Updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating participation");
        }
    }


    @GetMapping("/all-participation")
    public ResponseEntity<?> getAllParticipation() {
        return ResponseEntity.ok().body(participationService.getAllParticipation());
    }

    @GetMapping("admin/all-participation")
    public ResponseEntity<?> getAllAdminParticipation(@RequestParam String periodId) {
        return ResponseEntity.ok().body(participationService.getAllMissingActivitiesByAdmin(Long.valueOf(periodId)));
    }
    @PutMapping("/admin/accept-participation")
    public ResponseEntity<?> acceptParticipation(@RequestPart String studentId, @RequestPart String activityId) {
        ParticipationId participationId = new ParticipationId();
        participationId.setStudentId(Long.valueOf(studentId));
        participationId.setActivityId(Long.valueOf(activityId));
        Participation participation = participationRepository.findById(participationId).orElseThrow(() -> new RuntimeException("Participation not found"));
        participation.setRequest(false);
        participation.setActive(true);
        participationRepository.save(participation);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/admin/decline-participation")
    public ResponseEntity<?> declineParticipation(@RequestPart String studentId, @RequestPart String activityId) {
        ParticipationId participationId = new ParticipationId();
        participationId.setStudentId(Long.valueOf(studentId));
        participationId.setActivityId(Long.valueOf(activityId));
        Participation participation = participationRepository.findById(participationId).orElse(null);
        participation.setActive(false);
        participation.setRequest(false);
        participationRepository.save(participation);
        return ResponseEntity.ok().build();
    }
}
