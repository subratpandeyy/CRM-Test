package com.crm.service;

import com.crm.dto.DealDto;
import com.crm.entity.Deal;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Account;
import com.crm.entity.Contact;
import com.crm.repository.DealRepository;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import com.crm.repository.AccountRepository;
import com.crm.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DealService {
    
    @Autowired
    private DealRepository dealRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private ContactRepository contactRepository;
    
    public DealDto createDeal(DealDto dealDto) {
        // Validate that orgId and memberId are provided (auto-populated by controller)
        if (dealDto.getOrgId() == null) {
            throw new RuntimeException("Organization ID is required");
        }
        if (dealDto.getMemberId() == null) {
            throw new RuntimeException("Member ID is required");
        }
        
        Organization organization = organizationRepository.findById(dealDto.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        Member member = memberRepository.findById(dealDto.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Account account = null;
        if (dealDto.getAccountId() != null) {
            account = accountRepository.findById(dealDto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
        }
        
        Contact contact = null;
        if (dealDto.getContactId() != null) {
            contact = contactRepository.findById(dealDto.getContactId())
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
        }
        
        Deal deal = new Deal();
        deal.setDealName(dealDto.getDealName());
        deal.setDescription(dealDto.getDescription());
        deal.setDealValue(dealDto.getDealValue());
        deal.setDealStage(dealDto.getDealStage());
        deal.setExpectedCloseDate(dealDto.getExpectedCloseDate());
        deal.setActualCloseDate(dealDto.getActualCloseDate());
        deal.setProbability(dealDto.getProbability());
        deal.setOrganization(organization);
        deal.setMember(member);
        deal.setAccount(account);
        deal.setContact(contact);
        
        Deal savedDeal = dealRepository.save(deal);
        return convertToDto(savedDeal);
    }
    
    @Transactional(readOnly = true)
    public List<DealDto> getDealsByOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        return dealRepository.findByOrganizationWithRelations(organization)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public DealDto getDealById(Long dealId) {
        Deal deal = dealRepository.findByIdWithRelations(dealId);
        if (deal == null) {
            throw new RuntimeException("Deal not found");
        }
        return convertToDto(deal);
    }
    
    public DealDto updateDeal(Long dealId, DealDto dealDto) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found"));
        
        deal.setDealName(dealDto.getDealName());
        deal.setDescription(dealDto.getDescription());
        deal.setDealValue(dealDto.getDealValue());
        deal.setDealStage(dealDto.getDealStage());
        deal.setExpectedCloseDate(dealDto.getExpectedCloseDate());
        deal.setActualCloseDate(dealDto.getActualCloseDate());
        deal.setProbability(dealDto.getProbability());
        
        if (dealDto.getAccountId() != null) {
            Account account = accountRepository.findById(dealDto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            deal.setAccount(account);
        }
        
        if (dealDto.getContactId() != null) {
            Contact contact = contactRepository.findById(dealDto.getContactId())
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
            deal.setContact(contact);
        }
        
        Deal savedDeal = dealRepository.save(deal);
        return convertToDto(savedDeal);
    }
    
    public void deleteDeal(Long dealId) {
        if (!dealRepository.existsById(dealId)) {
            throw new RuntimeException("Deal not found");
        }
        dealRepository.deleteById(dealId);
    }
    
    private DealDto convertToDto(Deal deal) {
        DealDto dto = new DealDto();
        dto.setDealId(deal.getDealId());
        dto.setDealName(deal.getDealName());
        dto.setDescription(deal.getDescription());
        dto.setDealValue(deal.getDealValue());
        dto.setDealStage(deal.getDealStage());
        dto.setExpectedCloseDate(deal.getExpectedCloseDate());
        dto.setActualCloseDate(deal.getActualCloseDate());
        dto.setProbability(deal.getProbability());
        dto.setOrgId(deal.getOrganization().getOrgId());
        dto.setMemberId(deal.getMember().getMemberId());
        dto.setAccountId(deal.getAccount() != null ? deal.getAccount().getAccountId() : null);
        dto.setContactId(deal.getContact() != null ? deal.getContact().getContactId() : null);
        dto.setCreatedAt(deal.getCreatedAt());
        dto.setUpdatedAt(deal.getUpdatedAt());
        return dto;
    }
}
