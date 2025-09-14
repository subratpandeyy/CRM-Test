package com.crm.service;

import com.crm.config.JwtConfig;
import com.crm.dto.JwtResponse;
import com.crm.dto.LoginRequest;
import com.crm.entity.Member;
import com.crm.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtConfig jwtConfig;
    
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Member member = memberRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + loginRequest.getEmail()));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), member.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        if (member.getStatus() != Member.MemberStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        String token = jwtConfig.generateToken(member.getEmail(), member.getOrganization().getOrgId(), member.getRole().getRoleName(), member.getMemberId());
        
        return new JwtResponse(
            token,
            member.getMemberId(),
            member.getEmail(),
            member.getName(),
            member.getOrganization().getOrgId(),
            member.getOrganization().getOrgName(),
            member.getRole().getRoleName()
        );
    }
}
