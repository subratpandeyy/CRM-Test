package com.crm.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

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
    
    private Long orgId;
    
    private Long memberId;
    
    private String memberName;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime updatedAt;
    
    // Constructors
    public LeadDto() {}
    
    public LeadDto(Long leadId, String leadName, String leadEmail, String phone, Boolean isVerified,
                  Long orgId, Long memberId, String memberName, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
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
    
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
