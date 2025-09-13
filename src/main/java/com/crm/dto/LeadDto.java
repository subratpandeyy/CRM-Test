package com.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class LeadDto {
    
    private Long leadId;
    
    @NotBlank(message = "Lead name is required")
    @Size(max = 100, message = "Lead name must not exceed 100 characters")
    private String leadName;
    
    @NotBlank(message = "Lead email is required")
    @Email(message = "Lead email must be valid")
    @Size(max = 100, message = "Lead email must not exceed 100 characters")
    private String leadEmail;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;
    
    private Boolean isVerified;
    
    @NotNull(message = "Organization ID is required")
    private Long orgId;
    
    @NotNull(message = "Member ID is required")
    private Long memberId;
    
    private String memberName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public LeadDto() {}
    
    public LeadDto(Long leadId, String leadName, String leadEmail, String phone, Boolean isVerified,
                  Long orgId, Long memberId, String memberName, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.leadId = leadId;
        this.leadName = leadName;
        this.leadEmail = leadEmail;
        this.phone = phone;
        this.isVerified = isVerified;
        this.orgId = orgId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getLeadId() {
        return leadId;
    }
    
    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }
    
    public String getLeadName() {
        return leadName;
    }
    
    public void setLeadName(String leadName) {
        this.leadName = leadName;
    }
    
    public String getLeadEmail() {
        return leadEmail;
    }
    
    public void setLeadEmail(String leadEmail) {
        this.leadEmail = leadEmail;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public Boolean getIsVerified() {
        return isVerified;
    }
    
    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }
    
    public Long getOrgId() {
        return orgId;
    }
    
    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }
    
    public Long getMemberId() {
        return memberId;
    }
    
    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
    
    public String getMemberName() {
        return memberName;
    }
    
    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
