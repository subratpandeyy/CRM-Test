package com.crm.controller;

import com.crm.dto.ContactDto;
import com.crm.service.ContactService;
import com.crm.util.AuthenticationUtils;
import jakarta.servlet.http.HttpServletRequest;
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
    
    @Autowired
    private AuthenticationUtils authenticationUtils;
    
    @PostMapping
    public ResponseEntity<?> createContact(@Valid @RequestBody ContactDto contactDto, Authentication authentication, HttpServletRequest request) {
        try {
            // Extract orgId and memberId from JWT token
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            Long memberId = authenticationUtils.getMemberIdFromAuthentication(authentication, request);
            
            contactDto.setOrgId(orgId);
            contactDto.setMemberId(memberId);
            
            ContactDto createdContact = contactService.createContact(contactDto);
            return ResponseEntity.ok(createdContact);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getContactsByOrganization(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
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
    
}
