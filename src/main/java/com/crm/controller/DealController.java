package com.crm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin(origins = "*")
public class DealController {
    
    @GetMapping
    public ResponseEntity<?> getDealsByOrganization(Authentication authentication) {
        try {
            // Return empty list for now
            List<Object> deals = new ArrayList<>();
            return ResponseEntity.ok(deals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
