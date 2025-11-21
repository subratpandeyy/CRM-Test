package com.crm.controller;

import com.crm.dto.DealDto;
import com.crm.service.DealService;
import com.crm.util.AuthenticationUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('Admin','Manager','Sales Rep')")
public class DealController {
    
    @Autowired
    private DealService dealService;
    
    @Autowired
    private AuthenticationUtils authenticationUtils;
    
    @PostMapping
    public ResponseEntity<?> createDeal(@Valid @RequestBody DealDto dealDto, Authentication authentication, HttpServletRequest request) {
        try {
            // Extract orgId and memberId from JWT token
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            Long memberId = authenticationUtils.getMemberIdFromAuthentication(authentication, request);
            
            dealDto.setOrgId(orgId);
            dealDto.setMemberId(memberId);
            
            DealDto createdDeal = dealService.createDeal(dealDto);
            return ResponseEntity.ok(createdDeal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getDealsByOrganization(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            List<DealDto> deals = dealService.getDealsByOrganization(orgId);
            return ResponseEntity.ok(deals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getDealSummary(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            return ResponseEntity.ok(dealService.getMonthlySummary(orgId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/stages")
    public ResponseEntity<?> getDealStageDistribution(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            return ResponseEntity.ok(dealService.getStageDistribution(orgId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{dealId}")
    public ResponseEntity<?> getDealById(@PathVariable Long dealId) {
        try {
            DealDto deal = dealService.getDealById(dealId);
            return ResponseEntity.ok(deal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{dealId}")
    public ResponseEntity<?> updateDeal(@PathVariable Long dealId, @Valid @RequestBody DealDto dealDto) {
        try {
            DealDto updatedDeal = dealService.updateDeal(dealId, dealDto);
            return ResponseEntity.ok(updatedDeal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{dealId}")
    public ResponseEntity<?> deleteDeal(@PathVariable Long dealId) {
        try {
            dealService.deleteDeal(dealId);
            return ResponseEntity.ok("Deal deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    private Long getOrgIdFromAuthentication(Authentication authentication) {
        // Extract orgId from JWT token claims
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            return 1L; // Default orgId for now
        }
        return 1L; // Default fallback
    }
}
