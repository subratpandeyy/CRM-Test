package com.crm.controller;

import com.crm.dto.AccountDto;
import com.crm.service.AccountService;
import com.crm.util.AuthenticationUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private AuthenticationUtils authenticationUtils;
    
    @PostMapping
    public ResponseEntity<?> createAccount(@Valid @RequestBody AccountDto accountDto, Authentication authentication, HttpServletRequest request) {
        try {
            // Extract orgId and memberId from JWT token
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            Long memberId = authenticationUtils.getMemberIdFromAuthentication(authentication, request);
            
            accountDto.setOrgId(orgId);
            accountDto.setMemberId(memberId);
            
            AccountDto createdAccount = accountService.createAccount(accountDto);
            return ResponseEntity.ok(createdAccount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAccountsByOrganization(Authentication authentication, HttpServletRequest request) {
        try {
            Long orgId = authenticationUtils.getOrgIdFromAuthentication(authentication, request);
            List<AccountDto> accounts = accountService.getAccountsByOrganization(orgId);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{accountId}")
    public ResponseEntity<?> getAccountById(@PathVariable Long accountId) {
        try {
            AccountDto account = accountService.getAccountById(accountId);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{accountId}")
    public ResponseEntity<?> updateAccount(@PathVariable Long accountId, @Valid @RequestBody AccountDto accountDto) {
        try {
            AccountDto updatedAccount = accountService.updateAccount(accountId, accountDto);
            return ResponseEntity.ok(updatedAccount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{accountId}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long accountId) {
        try {
            accountService.deleteAccount(accountId);
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
}
