package com.crm.service;

import com.crm.config.JwtConfig;
import com.crm.dto.JwtResponse;
import com.crm.dto.LoginRequest;
import com.crm.entity.Member;
import com.crm.repository.MemberRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class SimpleAuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(SimpleAuthService.class);
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtConfig jwtConfig;
    
    @Transactional(readOnly = true)
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        logger.info("SimpleAuthService: Starting authentication for email: {}", loginRequest.getEmail());
        
        try {
            // Use the existing JPQL query that works with Hibernate entities
            Optional<Member> memberOpt = memberRepository.findByEmailWithRoleAndOrganization(loginRequest.getEmail());
            
            if (!memberOpt.isPresent()) {
                logger.warn("SimpleAuthService: No user found with email: {}", loginRequest.getEmail());
                throw new RuntimeException("User not found with email: " + loginRequest.getEmail());
            }
            
            Member member = memberOpt.get();
            logger.info("SimpleAuthService: Member found - ID: {}, Email: {}, Name: {}, Status: {}", 
                       member.getMemberId(), member.getEmail(), member.getName(), member.getStatus());
            
            // Extract data from the Member entity with null checks
            Long memberId = member.getMemberId();
            String email = member.getEmail();
            String name = member.getName();
            String password = member.getPassword();
            String status = member.getStatus() != null ? member.getStatus().toString() : null;
            
            // Safely extract organization data
            Long orgId = null;
            String orgName = null;
            if (member.getOrganization() != null) {
                orgId = member.getOrganization().getOrgId();
                orgName = member.getOrganization().getOrgName();
            }
            
            // Safely extract role data
            String roleName = null;
            if (member.getRole() != null) {
                roleName = member.getRole().getRoleName();
            }
            
            logger.info("SimpleAuthService: Extracted data - memberId: {}, email: {}, name: {}, status: {}, orgId: {}, orgName: {}, roleName: {}", 
                       memberId, email, name, status, orgId, orgName, roleName);
            
            // Validate required fields
            if (memberId == null || email == null || password == null || status == null || orgId == null || roleName == null) {
                logger.error("SimpleAuthService: Missing required user data - memberId: {}, email: {}, password: {}, status: {}, orgId: {}, roleName: {}", 
                           memberId, email, password != null ? "[PROVIDED]" : "[NULL]", status, orgId, roleName);
                throw new RuntimeException("Incomplete user data in database");
            }
            
            // Validate password
            if (!passwordEncoder.matches(loginRequest.getPassword(), password)) {
                logger.warn("SimpleAuthService: Invalid password for email: {}", loginRequest.getEmail());
                throw new RuntimeException("Invalid password");
            }
            
            // Validate status
            if (!"ACTIVE".equals(status)) {
                logger.warn("SimpleAuthService: Account not active for email: {}, status: {}", loginRequest.getEmail(), status);
                throw new RuntimeException("Account is not active");
            }
            
            // Generate JWT token
            String token = jwtConfig.generateToken(email, orgId, roleName, memberId);
            logger.info("SimpleAuthService: JWT token generated successfully, length: {}", token.length());
            
            // Return JwtResponse with primitive types only - no entities involved
            JwtResponse response = new JwtResponse(
                token,
                memberId,
                email,
                name,
                orgId,
                orgName,
                roleName
            );
            
            logger.info("SimpleAuthService: JwtResponse created successfully");
            return response;
            
        } catch (Exception e) {
            logger.error("SimpleAuthService: Error during authentication for email: {} - {}", loginRequest.getEmail(), e.getMessage(), e);
            throw e;
        }
    }
}
