package com.crm.service;

import com.crm.dto.ContactDto;
import com.crm.entity.Contact;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Account;
import com.crm.repository.ContactRepository;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import com.crm.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Transactional
    public ContactDto createContact(ContactDto contactDto) {
        // Validate that orgId and memberId are provided (auto-populated by controller)
        if (contactDto.getOrgId() == null) {
            throw new RuntimeException("Organization ID is required");
        }
        if (contactDto.getMemberId() == null) {
            throw new RuntimeException("Member ID is required");
        }
        
        Organization organization = organizationRepository.findById(contactDto.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        Member member = memberRepository.findById(contactDto.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Account account = null;
        if (contactDto.getAccountId() != null) {
            account = accountRepository.findById(contactDto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
        }
        
        Contact contact = new Contact();
        contact.setContactName(contactDto.getContactName());
        contact.setContactEmail(contactDto.getContactEmail());
        contact.setPhone(contactDto.getPhone());
        contact.setOrganization(organization);
        contact.setMember(member);
        contact.setAccount(account);
        
        Contact savedContact = contactRepository.save(contact);
        return convertToDto(savedContact);
    }
    
    @Transactional(readOnly = true)
    public List<ContactDto> getContactsByOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        return contactRepository.findByOrganizationWithRelations(organization)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ContactDto> getContactsByMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        return contactRepository.findByMemberWithRelations(member)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ContactDto> getContactsByAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        return contactRepository.findByAccount(account)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ContactDto getContactById(Long contactId) {
        Contact contact = contactRepository.findByIdWithRelations(contactId);
        if (contact == null) {
            throw new RuntimeException("Contact not found");
        }
        return convertToDto(contact);
    }
    
    @Transactional
    public ContactDto updateContact(Long contactId, ContactDto contactDto) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        
        contact.setContactName(contactDto.getContactName());
        contact.setContactEmail(contactDto.getContactEmail());
        contact.setPhone(contactDto.getPhone());
        
        if (contactDto.getAccountId() != null) {
            Account account = accountRepository.findById(contactDto.getAccountId())
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            contact.setAccount(account);
        }
        
        Contact savedContact = contactRepository.save(contact);
        return convertToDto(savedContact);
    }
    
    @Transactional
    public void deleteContact(Long contactId) {
        if (!contactRepository.existsById(contactId)) {
            throw new RuntimeException("Contact not found");
        }
        contactRepository.deleteById(contactId);
    }
    
    private ContactDto convertToDto(Contact contact) {
        return new ContactDto(
            contact.getContactId(),
            contact.getContactName(),
            contact.getContactEmail(),
            contact.getPhone(),
            contact.getOrganization().getOrgId(),
            contact.getMember().getMemberId(),
            contact.getAccount() != null ? contact.getAccount().getAccountId() : null,
            contact.getMember().getName(),
            contact.getAccount() != null ? contact.getAccount().getAccountName() : null,
            contact.getCreatedAt(),
            contact.getUpdatedAt()
        );
    }
}
