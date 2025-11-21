package com.crm.controller;

import com.crm.dto.LeadDto;
import com.crm.service.LeadService;
import com.crm.util.AuthenticationUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('Admin','Manager','Sales Rep')")
public class LeadController {
    
    @Autowired
    private LeadService leadService;
    
    @Autowired
    private AuthenticationUtils authenticationUtils;
    
    @PostMapping
    public ResponseEntity<?> createLead(@Valid @RequestBody LeadDto leadDto, Authentication authentication, HttpServletRequest request) {
        try {
            // Extract orgId and memberId from JWT token
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            Long memberId = authenticationUtils.getMemberIdFromAuthentication(authentication, request);
            
            leadDto.setOrgId(orgId);
            leadDto.setMemberId(memberId);
            
            LeadDto createdLead = leadService.createLead(leadDto);
            return ResponseEntity.ok(createdLead);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getLeadsByOrganization(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            List<LeadDto> leads = leadService.getLeadsByOrganization(orgId);
            return ResponseEntity.ok(leads);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getLeadSummary(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            return ResponseEntity.ok(leadService.getMonthlySummary(orgId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{leadId}")
    public ResponseEntity<?> getLeadById(@PathVariable Long leadId) {
        try {
            LeadDto lead = leadService.getLeadById(leadId);
            return ResponseEntity.ok(lead);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{leadId}")
    public ResponseEntity<?> updateLead(@PathVariable Long leadId, @Valid @RequestBody LeadDto leadDto) {
        try {
            LeadDto updatedLead = leadService.updateLead(leadId, leadDto);
            return ResponseEntity.ok(updatedLead);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{leadId}")
    public ResponseEntity<?> deleteLead(@PathVariable Long leadId) {
        try {
            leadService.deleteLead(leadId);
            return ResponseEntity.ok("Lead deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{leadId}/status")
    public ResponseEntity<?> updateLeadStatus(@PathVariable Long leadId, @RequestParam Boolean isVerified) {
        try {
            LeadDto updatedLead = leadService.updateLeadStatus(leadId, isVerified);
            return ResponseEntity.ok(updatedLead);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
}
