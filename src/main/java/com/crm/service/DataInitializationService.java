package com.crm.service;

import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Role;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import com.crm.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeTestData();
    }
    
    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            // Create default roles
            Role adminRole = new Role("Admin");
            Role managerRole = new Role("Manager");
            Role salesRepRole = new Role("Sales Rep");
            Role userRole = new Role("User");
            
            roleRepository.save(adminRole);
            roleRepository.save(managerRole);
            roleRepository.save(salesRepRole);
            roleRepository.save(userRole);
            
            System.out.println("Default roles initialized successfully");
        }
    }
    
    private void initializeTestData() {
        // Create test organization if it doesn't exist
        if (organizationRepository.count() == 0) {
            Organization testOrg = new Organization();
            testOrg.setOrgName("Test Organization");
            testOrg.setOrgEmail("admin@testorg.com");
            organizationRepository.save(testOrg);
            
            System.out.println("Test organization created successfully");
        }
        
        // Create test user if it doesn't exist
        if (memberRepository.count() == 0) {
            // Get the first organization and admin role
            Organization testOrg = organizationRepository.findAll().get(0);
            Role adminRole = roleRepository.findByRoleName("Admin").orElse(null);
            
            if (testOrg != null && adminRole != null) {
                Member testUser = new Member();
                testUser.setName("Test Admin");
                testUser.setEmail("admin@test.com");
                testUser.setPassword(passwordEncoder.encode("password123"));
                testUser.setStatus(Member.MemberStatus.ACTIVE);
                testUser.setOrganization(testOrg);
                testUser.setRole(adminRole);
                
                memberRepository.save(testUser);
                
                System.out.println("Test user created successfully:");
                System.out.println("Email: admin@test.com");
                System.out.println("Password: password123");
            }
        }
    }
}
