package com.crm.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public class OrganizationDto {
    
    private Long orgId;
    
    @NotBlank(message = "Organization name is required")
    @Size(max = 100, message = "Organization name must not exceed 100 characters")
    private String orgName;
    
    @NotBlank(message = "Organization email is required")
    @Email(message = "Organization email must be valid")
    @Size(max = 100, message = "Organization email must not exceed 100 characters")
    private String orgEmail;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private OffsetDateTime updatedAt;
    
    // Constructors
    public OrganizationDto() {}
    
    public OrganizationDto(Long orgId, String orgName, String orgEmail, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.orgId = orgId;
        this.orgName = orgName;
        this.orgEmail = orgEmail;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getOrgId() {
        return orgId;
    }
    
    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }
    
    public String getOrgName() {
        return orgName;
    }
    
    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }
    
    public String getOrgEmail() {
        return orgEmail;
    }
    
    public void setOrgEmail(String orgEmail) {
        this.orgEmail = orgEmail;
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
