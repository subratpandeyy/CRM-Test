package com.crm.controller;

import com.crm.dto.JwtResponse;
import com.crm.dto.LoginRequest;
import com.crm.dto.MemberDto;
import com.crm.dto.OrganizationDto;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import com.crm.repository.RoleRepository;
import com.crm.service.AuthService;
import com.crm.service.MemberService;
import com.crm.service.OrganizationService;
import com.crm.service.SimpleAuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private MemberService memberService;
    
    @Autowired
    private OrganizationService organizationService;
    
    @Autowired
    private SimpleAuthService simpleAuthService;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("=== LOGIN ATTEMPT ===");
        logger.info("Email: {}", loginRequest.getEmail());
        logger.info("Password length: {}", loginRequest.getPassword() != null ? loginRequest.getPassword().length() : 0);
        logger.info("Email is blank: {}", loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty());
        logger.info("Password is blank: {}", loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty());
        
        // Additional validation logging
        if (loginRequest.getEmail() != null) {
            logger.info("Email after trim: '{}'", loginRequest.getEmail().trim());
            logger.info("Email contains @: {}", loginRequest.getEmail().contains("@"));
        }
        
        try {
            // Validate the request before processing
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                logger.warn("Login failed: Email is null or empty");
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
                logger.warn("Login failed: Password is null or empty");
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            // Validate email format
            String email = loginRequest.getEmail().trim();
            if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
                logger.warn("Login failed: Invalid email format for: {}", email);
                return ResponseEntity.badRequest().body("Email must be valid");
            }
            
            logger.info("Request validation passed, proceeding with authentication...");
            
            try {
                JwtResponse jwtResponse = simpleAuthService.authenticateUser(loginRequest);
                logger.info("Login successful for email: {}", loginRequest.getEmail());
                logger.info("Generated token length: {}", jwtResponse.getToken() != null ? jwtResponse.getToken().length() : 0);
                logger.info("JWT Response details: memberId={}, name={}, orgId={}, role={}", 
                           jwtResponse.getMemberId(), jwtResponse.getName(), 
                           jwtResponse.getOrgId(), jwtResponse.getRole());
                return ResponseEntity.ok(jwtResponse);
            } catch (Exception authException) {
                logger.error("Authentication service error: {}", authException.getMessage(), authException);
                throw authException;
            }
        } catch (Exception e) {
            logger.error("Login failed for email: {} - Error: {}", loginRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/debug")
    public ResponseEntity<?> debugDatabase() {
        try {
            // Check if test user exists
            boolean userExists = memberRepository.existsByEmail("admin@test.com");
            long userCount = memberRepository.count();
            long orgCount = organizationRepository.count();
            long roleCount = roleRepository.count();
            
            String debugInfo = String.format(
                "Database Debug Info:\n" +
                "Total Users: %d\n" +
                "Total Organizations: %d\n" +
                "Total Roles: %d\n" +
                "Test User Exists: %s",
                userCount, orgCount, roleCount, userExists
            );
            
            logger.info("Debug info: {}", debugInfo);
            return ResponseEntity.ok(debugInfo);
        } catch (Exception e) {
            logger.error("Debug error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("Debug error: " + e.getMessage());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerOrganization(@Valid @RequestBody OrganizationRegistrationRequest request) {
        try {
            // Create organization
            OrganizationDto orgDto = new OrganizationDto();
            orgDto.setOrgName(request.getOrgName());
            orgDto.setOrgEmail(request.getOrgEmail());
            OrganizationDto createdOrg = organizationService.createOrganization(orgDto);
            
            // Create admin member
            MemberDto memberDto = new MemberDto();
            memberDto.setName(request.getAdminName());
            memberDto.setEmail(request.getAdminEmail());
            memberDto.setPassword(request.getAdminPassword());
            memberDto.setOrgId(createdOrg.getOrgId());
            memberDto.setRoleId(1L); // Assuming Admin role has ID 1
            MemberDto createdMember = memberService.createMember(memberDto);
            
            return ResponseEntity.ok("Organization and admin user created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // Inner class for registration request
    public static class OrganizationRegistrationRequest {
        private String orgName;
        private String orgEmail;
        private String adminName;
        private String adminEmail;
        private String adminPassword;
        
        // Constructors
        public OrganizationRegistrationRequest() {}
        
        // Getters and Setters
        public String getOrgName() {
            return orgName;
        }
        
        public void setOrgName(String orgName) {
            this.orgName = orgName;
        }
        
        public String getOrgEmail() {
            return orgEmail;
        }
        
        public void setOrgEmail(String orgEmail) {
            this.orgEmail = orgEmail;
        }
        
        public String getAdminName() {
            return adminName;
        }
        
        public void setAdminName(String adminName) {
            this.adminName = adminName;
        }
        
        public String getAdminEmail() {
            return adminEmail;
        }
        
        public void setAdminEmail(String adminEmail) {
            this.adminEmail = adminEmail;
        }
        
        public String getAdminPassword() {
            return adminPassword;
        }
        
        public void setAdminPassword(String adminPassword) {
            this.adminPassword = adminPassword;
        }
    }
}
