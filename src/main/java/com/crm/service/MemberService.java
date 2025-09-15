package com.crm.service;

import com.crm.config.JwtConfig;
import com.crm.dto.JwtResponse;
import com.crm.dto.LoginRequest;
import com.crm.dto.MemberDto;
import com.crm.dto.UserResponseDto;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Role;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import com.crm.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberService implements UserDetailsService {
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtConfig jwtConfig;
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Use a custom query with JOIN FETCH to avoid lazy loading issues
        return memberRepository.findByEmailWithRoleAndOrganization(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
    
    @Transactional(readOnly = true)
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        // Use a custom query that returns only the data we need, avoiding entity serialization
        Object[] result = memberRepository.findUserDataForAuth(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + loginRequest.getEmail()));
        
        // Extract data from the query result
        Long memberId = (Long) result[0];
        String email = (String) result[1];
        String name = (String) result[2];
        String password = (String) result[3];
        String status = (String) result[4];
        Long orgId = (Long) result[5];
        String orgName = (String) result[6];
        String roleName = (String) result[7];
        
        // Validate password
        if (!passwordEncoder.matches(loginRequest.getPassword(), password)) {
            throw new RuntimeException("Invalid password");
        }
        
        // Validate status
        if (!"ACTIVE".equals(status)) {
            throw new RuntimeException("Account is not active");
        }
        
        // Generate JWT token
        String token = jwtConfig.generateToken(email, orgId, roleName, memberId);
        
        // Return JwtResponse with primitive types only
        return new JwtResponse(
            token,
            memberId,
            email,
            name,
            orgId,
            orgName,
            roleName
        );
    }
    
    @Transactional(readOnly = true)
    public UserResponseDto authenticateUserForLogin(LoginRequest loginRequest) {
        Member member = memberRepository.findByEmailWithRoleAndOrganization(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + loginRequest.getEmail()));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), member.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        if (member.getStatus() != Member.MemberStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }
        
        // Generate JWT token
        String token = jwtConfig.generateToken(
            member.getEmail(),
            member.getOrganization().getOrgId(),
            member.getRole().getRoleName(),
            member.getMemberId()
        );
        
        // Build and return DTO with only the required fields
        return new UserResponseDto(
            member.getMemberId(),
            member.getEmail(),
            member.getRole().getRoleName(),
            token
        );
    }
    
    public MemberDto createMember(MemberDto memberDto) {
        if (memberRepository.existsByEmail(memberDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        Organization organization = organizationRepository.findById(memberDto.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        Role role = roleRepository.findById(memberDto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        Member member = new Member();
        member.setName(memberDto.getName());
        member.setEmail(memberDto.getEmail());
        member.setPassword(passwordEncoder.encode(memberDto.getPassword()));
        member.setStatus(memberDto.getStatus() != null ? memberDto.getStatus() : Member.MemberStatus.ACTIVE);
        member.setOrganization(organization);
        member.setRole(role);
        
        Member savedMember = memberRepository.save(member);
        return convertToDto(savedMember);
    }
    
    public List<MemberDto> getMembersByOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        return memberRepository.findByOrganization(organization)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public MemberDto getMemberById(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        return convertToDto(member);
    }
    
    public List<MemberDto> getAllMembers() {
        return memberRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public MemberDto updateMember(Long memberId, MemberDto memberDto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        member.setName(memberDto.getName());
        member.setEmail(memberDto.getEmail());
        
        if (memberDto.getPassword() != null && !memberDto.getPassword().isEmpty()) {
            member.setPassword(passwordEncoder.encode(memberDto.getPassword()));
        }
        
        if (memberDto.getStatus() != null) {
            member.setStatus(memberDto.getStatus());
        }
        
        if (memberDto.getRoleId() != null) {
            Role role = roleRepository.findById(memberDto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            member.setRole(role);
        }
        
        Member savedMember = memberRepository.save(member);
        return convertToDto(savedMember);
    }
    
    public void deleteMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new RuntimeException("Member not found");
        }
        memberRepository.deleteById(memberId);
    }
    
    public MemberDto updateMemberStatus(Long memberId, Member.MemberStatus status) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        member.setStatus(status);
        Member savedMember = memberRepository.save(member);
        return convertToDto(savedMember);
    }
    
    private MemberDto convertToDto(Member member) {
        return new MemberDto(
            member.getMemberId(),
            member.getName(),
            member.getEmail(),
            member.getStatus(),
            member.getOrganization().getOrgId(),
            member.getRole().getRoleId(),
            member.getOrganization().getOrgName(),
            member.getRole().getRoleName(),
            member.getCreatedAt(),
            member.getUpdatedAt()
        );
    }
}
