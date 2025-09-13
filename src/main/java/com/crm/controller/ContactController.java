package com.crm.controller;

import com.crm.dto.ContactDto;
import com.crm.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "*")
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    @PostMapping
    public ResponseEntity<?> createContact(@Valid @RequestBody ContactDto contactDto, Authentication authentication) {
        try {
            Long orgId = getOrgIdFromAuthentication(authentication);
            contactDto.setOrgId(orgId);
            
            ContactDto createdContact = contactService.createContact(contactDto);
            return ResponseEntity.ok(createdContact);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getContactsByOrganization(Authentication authentication) {
        try {
            Long orgId = getOrgIdFromAuthentication(authentication);
            List<ContactDto> contacts = contactService.getContactsByOrganization(orgId);
            return ResponseEntity.ok(contacts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{contactId}")
    public ResponseEntity<?> getContactById(@PathVariable Long contactId) {
        try {
            ContactDto contact = contactService.getContactById(contactId);
            return ResponseEntity.ok(contact);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{contactId}")
    public ResponseEntity<?> updateContact(@PathVariable Long contactId, @Valid @RequestBody ContactDto contactDto) {
        try {
            ContactDto updatedContact = contactService.updateContact(contactId, contactDto);
            return ResponseEntity.ok(updatedContact);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{contactId}")
    public ResponseEntity<?> deleteContact(@PathVariable Long contactId) {
        try {
            contactService.deleteContact(contactId);
            return ResponseEntity.ok("Contact deleted successfully");
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
