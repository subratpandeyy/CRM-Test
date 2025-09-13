package com.crm.service;

import com.crm.dto.LeadDto;
import com.crm.entity.Lead;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.repository.LeadRepository;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeadService {
    
    @Autowired
    private LeadRepository leadRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    public LeadDto createLead(LeadDto leadDto) {
        Organization organization = organizationRepository.findById(leadDto.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        Member member = memberRepository.findById(leadDto.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Lead lead = new Lead();
        lead.setLeadName(leadDto.getLeadName());
        lead.setLeadEmail(leadDto.getLeadEmail());
        lead.setPhone(leadDto.getPhone());
        lead.setIsVerified(leadDto.getIsVerified() != null ? leadDto.getIsVerified() : false);
        lead.setOrganization(organization);
        lead.setMember(member);
        
        Lead savedLead = leadRepository.save(lead);
        return convertToDto(savedLead);
    }
    
    public List<LeadDto> getLeadsByOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        return leadRepository.findByOrganization(organization)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<LeadDto> getLeadsByMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        return leadRepository.findByMember(member)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public LeadDto getLeadById(Long leadId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        return convertToDto(lead);
    }
    
    public LeadDto updateLead(Long leadId, LeadDto leadDto) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        
        lead.setLeadName(leadDto.getLeadName());
        lead.setLeadEmail(leadDto.getLeadEmail());
        lead.setPhone(leadDto.getPhone());
        
        if (leadDto.getIsVerified() != null) {
            lead.setIsVerified(leadDto.getIsVerified());
        }
        
        Lead savedLead = leadRepository.save(lead);
        return convertToDto(savedLead);
    }
    
    public void deleteLead(Long leadId) {
        if (!leadRepository.existsById(leadId)) {
            throw new RuntimeException("Lead not found");
        }
        leadRepository.deleteById(leadId);
    }
    
    public LeadDto updateLeadStatus(Long leadId, Boolean isVerified) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        
        lead.setIsVerified(isVerified);
        Lead savedLead = leadRepository.save(lead);
        return convertToDto(savedLead);
    }
    
    private LeadDto convertToDto(Lead lead) {
        return new LeadDto(
            lead.getLeadId(),
            lead.getLeadName(),
            lead.getLeadEmail(),
            lead.getPhone(),
            lead.getIsVerified(),
            lead.getOrganization().getOrgId(),
            lead.getMember().getMemberId(),
            lead.getMember().getName(),
            lead.getCreatedAt(),
            lead.getUpdatedAt()
        );
    }
}
