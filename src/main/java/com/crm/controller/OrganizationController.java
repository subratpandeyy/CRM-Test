package com.crm.controller;

import com.crm.dto.OrganizationDto;
import com.crm.service.OrganizationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "*")
public class OrganizationController {
    
    @Autowired
    private OrganizationService organizationService;
    
    @PostMapping
    public ResponseEntity<?> createOrganization(@Valid @RequestBody OrganizationDto organizationDto) {
        try {
            OrganizationDto createdOrganization = organizationService.createOrganization(organizationDto);
            return ResponseEntity.ok(createdOrganization);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllOrganizations() {
        try {
            List<OrganizationDto> organizations = organizationService.getAllOrganizations();
            return ResponseEntity.ok(organizations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{orgId}")
    public ResponseEntity<?> getOrganizationById(@PathVariable Long orgId) {
        try {
            OrganizationDto organization = organizationService.getOrganizationById(orgId);
            return ResponseEntity.ok(organization);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{orgId}")
    public ResponseEntity<?> updateOrganization(@PathVariable Long orgId, @Valid @RequestBody OrganizationDto organizationDto) {
        try {
            OrganizationDto updatedOrganization = organizationService.updateOrganization(orgId, organizationDto);
            return ResponseEntity.ok(updatedOrganization);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{orgId}")
    public ResponseEntity<?> deleteOrganization(@PathVariable Long orgId) {
        try {
            organizationService.deleteOrganization(orgId);
            return ResponseEntity.ok("Organization deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}

