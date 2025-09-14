package com.crm.service;

import com.crm.dto.ActivityDto;
import com.crm.entity.Activity;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Account;
import com.crm.entity.Contact;
import com.crm.entity.Deal;
import com.crm.entity.Lead;
import com.crm.repository.ActivityRepository;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import com.crm.repository.AccountRepository;
import com.crm.repository.ContactRepository;
import com.crm.repository.DealRepository;
import com.crm.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActivityService {
    
    @Autowired
    private ActivityRepository activityRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private DealRepository dealRepository;
    
    @Autowired
    private LeadRepository leadRepository;
    
    public ActivityDto createActivity(ActivityDto activityDto) {
        // Validate that orgId and memberId are provided (auto-populated by controller)
        if (activityDto.getOrgId() == null) {
            throw new RuntimeException("Organization ID is required");
        }
        if (activityDto.getMemberId() == null) {
            throw new RuntimeException("Member ID is required");
        }
        
        Organization organization = organizationRepository.findById(activityDto.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        Member member = memberRepository.findById(activityDto.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Account account = null;
        if (activityDto.getAccountId() != null) {
            account = accountRepository.findById(activityDto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
        }
        
        Contact contact = null;
        if (activityDto.getContactId() != null) {
            contact = contactRepository.findById(activityDto.getContactId())
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
        }
        
        Deal deal = null;
        if (activityDto.getDealId() != null) {
            deal = dealRepository.findById(activityDto.getDealId())
                    .orElseThrow(() -> new RuntimeException("Deal not found"));
        }
        
        Lead lead = null;
        if (activityDto.getLeadId() != null) {
            lead = leadRepository.findById(activityDto.getLeadId())
                    .orElseThrow(() -> new RuntimeException("Lead not found"));
        }
        
        Activity activity = new Activity();
        activity.setActivityType(activityDto.getActivityType());
        activity.setSubject(activityDto.getSubject());
        activity.setDescription(activityDto.getDescription());
        activity.setActivityDate(activityDto.getActivityDate());
        activity.setStatus(activityDto.getStatus());
        activity.setPriority(activityDto.getPriority());
        activity.setOrganization(organization);
        activity.setMember(member);
        activity.setAccount(account);
        activity.setContact(contact);
        activity.setDeal(deal);
        activity.setLead(lead);
        
        Activity savedActivity = activityRepository.save(activity);
        return convertToDto(savedActivity);
    }
    
    @Transactional(readOnly = true)
    public List<ActivityDto> getActivitiesByOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        return activityRepository.findByOrganizationWithRelations(organization)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ActivityDto getActivityById(Long activityId) {
        Activity activity = activityRepository.findByIdWithRelations(activityId);
        if (activity == null) {
            throw new RuntimeException("Activity not found");
        }
        return convertToDto(activity);
    }
    
    public ActivityDto updateActivity(Long activityId, ActivityDto activityDto) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        
        activity.setActivityType(activityDto.getActivityType());
        activity.setSubject(activityDto.getSubject());
        activity.setDescription(activityDto.getDescription());
        activity.setActivityDate(activityDto.getActivityDate());
        activity.setStatus(activityDto.getStatus());
        activity.setPriority(activityDto.getPriority());
        
        if (activityDto.getAccountId() != null) {
            Account account = accountRepository.findById(activityDto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            activity.setAccount(account);
        }
        
        if (activityDto.getContactId() != null) {
            Contact contact = contactRepository.findById(activityDto.getContactId())
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
            activity.setContact(contact);
        }
        
        if (activityDto.getDealId() != null) {
            Deal deal = dealRepository.findById(activityDto.getDealId())
                    .orElseThrow(() -> new RuntimeException("Deal not found"));
            activity.setDeal(deal);
        }
        
        if (activityDto.getLeadId() != null) {
            Lead lead = leadRepository.findById(activityDto.getLeadId())
                    .orElseThrow(() -> new RuntimeException("Lead not found"));
            activity.setLead(lead);
        }
        
        Activity savedActivity = activityRepository.save(activity);
        return convertToDto(savedActivity);
    }
    
    public void deleteActivity(Long activityId) {
        if (!activityRepository.existsById(activityId)) {
            throw new RuntimeException("Activity not found");
        }
        activityRepository.deleteById(activityId);
    }
    
    private ActivityDto convertToDto(Activity activity) {
        ActivityDto dto = new ActivityDto();
        dto.setActivityId(activity.getActivityId());
        dto.setActivityType(activity.getActivityType());
        dto.setSubject(activity.getSubject());
        dto.setDescription(activity.getDescription());
        dto.setActivityDate(activity.getActivityDate());
        dto.setStatus(activity.getStatus());
        dto.setPriority(activity.getPriority());
        dto.setOrgId(activity.getOrganization().getOrgId());
        dto.setMemberId(activity.getMember().getMemberId());
        dto.setAccountId(activity.getAccount() != null ? activity.getAccount().getAccountId() : null);
        dto.setContactId(activity.getContact() != null ? activity.getContact().getContactId() : null);
        dto.setDealId(activity.getDeal() != null ? activity.getDeal().getDealId() : null);
        dto.setLeadId(activity.getLead() != null ? activity.getLead().getLeadId() : null);
        dto.setCreatedAt(activity.getCreatedAt());
        dto.setUpdatedAt(activity.getUpdatedAt());
        return dto;
    }
}
