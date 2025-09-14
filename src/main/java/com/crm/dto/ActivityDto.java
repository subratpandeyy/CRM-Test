package com.crm.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class ActivityDto {
    private Long activityId;
    
    @NotBlank(message = "Activity type is required")
    @Size(max = 50, message = "Activity type must not exceed 50 characters")
    private String activityType;
    
    @NotBlank(message = "Activity subject is required")
    @Size(max = 200, message = "Activity subject must not exceed 200 characters")
    private String subject;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Activity date is required")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime activityDate;
    
    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String status;
    
    @Size(max = 50, message = "Priority must not exceed 50 characters")
    private String priority;
    
    @NotNull(message = "Organization ID is required")
    private Long orgId;
    
    private Long memberId;
    private Long leadId;
    private Long contactId;
    private Long accountId;
    private Long dealId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Constructors
    public ActivityDto() {}
    
    public ActivityDto(String activityType, String subject, String description, 
                       LocalDateTime activityDate, String status, String priority, 
                       Long orgId, Long memberId, Long leadId, Long contactId, 
                       Long accountId, Long dealId) {
        this.activityType = activityType;
        this.subject = subject;
        this.description = description;
        this.activityDate = activityDate;
        this.status = status;
        this.priority = priority;
        this.orgId = orgId;
        this.memberId = memberId;
        this.leadId = leadId;
        this.contactId = contactId;
        this.accountId = accountId;
        this.dealId = dealId;
    }
    
    // Getters and Setters
    public Long getActivityId() {
        return activityId;
    }
    
    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }
    
    public String getActivityType() {
        return activityType;
    }
    
    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getActivityDate() {
        return activityDate;
    }
    
    public void setActivityDate(LocalDateTime activityDate) {
        this.activityDate = activityDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
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
    
    public Long getLeadId() {
        return leadId;
    }
    
    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }
    
    public Long getContactId() {
        return contactId;
    }
    
    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }
    
    public Long getAccountId() {
        return accountId;
    }
    
    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }
    
    public Long getDealId() {
        return dealId;
    }
    
    public void setDealId(Long dealId) {
        this.dealId = dealId;
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
