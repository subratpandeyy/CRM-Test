package com.crm.service;

import com.crm.dto.AccountDto;
import com.crm.entity.Account;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.repository.AccountRepository;
import com.crm.repository.MemberRepository;
import com.crm.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    public AccountDto createAccount(AccountDto accountDto) {
        // Validate that orgId and memberId are provided (auto-populated by controller)
        if (accountDto.getOrgId() == null) {
            throw new RuntimeException("Organization ID is required");
        }
        if (accountDto.getMemberId() == null) {
            throw new RuntimeException("Member ID is required");
        }
        
        // Check if email already exists
        if (accountDto.getEmail() != null && accountRepository.existsByEmail(accountDto.getEmail())) {
            throw new RuntimeException("Account with this email already exists");
        }
        
        Organization organization = organizationRepository.findById(accountDto.getOrgId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        Member member = memberRepository.findById(accountDto.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Account account = new Account();
        account.setAccountName(accountDto.getAccountName());
        account.setEmail(accountDto.getEmail());
        account.setPhone(accountDto.getPhone());
        account.setWebsite(accountDto.getWebsite());
        account.setDescription(accountDto.getDescription());
        account.setIndustry(accountDto.getIndustry());
        account.setAddress(accountDto.getAddress());
        account.setCity(accountDto.getCity());
        account.setState(accountDto.getState());
        account.setPostalCode(accountDto.getPostalCode());
        account.setCountry(accountDto.getCountry());
        account.setOrganization(organization);
        account.setMember(member);
        
        Account savedAccount = accountRepository.save(account);
        return convertToDto(savedAccount);
    }
    
    @Transactional(readOnly = true)
    public List<AccountDto> getAccountsByOrganization(Long orgId) {
        Organization organization = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        return accountRepository.findByOrganizationWithRelations(organization)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public AccountDto getAccountById(Long accountId) {
        Account account = accountRepository.findByIdWithRelations(accountId);
        if (account == null) {
            throw new RuntimeException("Account not found");
        }
        return convertToDto(account);
    }
    
    public AccountDto updateAccount(Long accountId, AccountDto accountDto) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        // Check if email already exists for another account
        if (accountDto.getEmail() != null && !accountDto.getEmail().equals(account.getEmail()) 
            && accountRepository.existsByEmail(accountDto.getEmail())) {
            throw new RuntimeException("Account with this email already exists");
        }
        
        account.setAccountName(accountDto.getAccountName());
        account.setEmail(accountDto.getEmail());
        account.setPhone(accountDto.getPhone());
        account.setWebsite(accountDto.getWebsite());
        account.setDescription(accountDto.getDescription());
        account.setIndustry(accountDto.getIndustry());
        account.setAddress(accountDto.getAddress());
        account.setCity(accountDto.getCity());
        account.setState(accountDto.getState());
        account.setPostalCode(accountDto.getPostalCode());
        account.setCountry(accountDto.getCountry());
        
        Account savedAccount = accountRepository.save(account);
        return convertToDto(savedAccount);
    }
    
    public void deleteAccount(Long accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new RuntimeException("Account not found");
        }
        accountRepository.deleteById(accountId);
    }
    
    private AccountDto convertToDto(Account account) {
        AccountDto dto = new AccountDto();
        dto.setAccountId(account.getAccountId());
        dto.setAccountName(account.getAccountName());
        dto.setEmail(account.getEmail());
        dto.setPhone(account.getPhone());
        dto.setWebsite(account.getWebsite());
        dto.setDescription(account.getDescription());
        dto.setIndustry(account.getIndustry());
        dto.setAddress(account.getAddress());
        dto.setCity(account.getCity());
        dto.setState(account.getState());
        dto.setPostalCode(account.getPostalCode());
        dto.setCountry(account.getCountry());
        dto.setOrgId(account.getOrganization().getOrgId());
        dto.setMemberId(account.getMember().getMemberId());
        dto.setCreatedAt(account.getCreatedAt());
        dto.setUpdatedAt(account.getUpdatedAt());
        return dto;
    }
}
