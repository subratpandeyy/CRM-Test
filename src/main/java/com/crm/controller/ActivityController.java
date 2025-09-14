package com.crm.controller;

import com.crm.dto.ActivityDto;
import com.crm.service.ActivityService;
import com.crm.util.AuthenticationUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private AuthenticationUtils authenticationUtils;
    
    @PostMapping
    public ResponseEntity<?> createActivity(@Valid @RequestBody ActivityDto activityDto, Authentication authentication, HttpServletRequest request) {
        try {
            // Extract orgId and memberId from JWT token
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            Long memberId = authenticationUtils.getMemberIdFromAuthentication(authentication, request);
            
            activityDto.setOrgId(orgId);
            activityDto.setMemberId(memberId);
            
            ActivityDto createdActivity = activityService.createActivity(activityDto);
            return ResponseEntity.ok(createdActivity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getActivitiesByOrganization(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            List<ActivityDto> activities = activityService.getActivitiesByOrganization(orgId);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{activityId}")
    public ResponseEntity<?> getActivityById(@PathVariable Long activityId) {
        try {
            ActivityDto activity = activityService.getActivityById(activityId);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{activityId}")
    public ResponseEntity<?> updateActivity(@PathVariable Long activityId, @Valid @RequestBody ActivityDto activityDto) {
        try {
            ActivityDto updatedActivity = activityService.updateActivity(activityId, activityDto);
            return ResponseEntity.ok(updatedActivity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{activityId}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long activityId) {
        try {
            activityService.deleteActivity(activityId);
            return ResponseEntity.ok("Activity deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
}
