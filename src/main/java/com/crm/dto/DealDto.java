package com.crm.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DealDto {
    private Long dealId;
    
    @NotBlank(message = "Deal name is required")
    @Size(max = 100, message = "Deal name must not exceed 100 characters")
    private String dealName;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    @NotNull(message = "Deal value is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Deal value must be greater than 0")
    private BigDecimal dealValue;
    
    @NotBlank(message = "Deal stage is required")
    @Size(max = 50, message = "Deal stage must not exceed 50 characters")
    private String dealStage;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expectedCloseDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actualCloseDate;
    
    @Size(max = 100, message = "Probability must not exceed 100 characters")
    private String probability;
    
    private Long orgId;
    
    private Long memberId;
    private Long accountId;
    private Long contactId;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Constructors
    public DealDto() {}
    
    public DealDto(String dealName, String description, BigDecimal dealValue, 
                   String dealStage, LocalDateTime expectedCloseDate, String probability, 
                   Long orgId, Long memberId, Long accountId, Long contactId) {
        this.dealName = dealName;
        this.description = description;
        this.dealValue = dealValue;
        this.dealStage = dealStage;
        this.expectedCloseDate = expectedCloseDate;
        this.probability = probability;
        this.orgId = orgId;
        this.memberId = memberId;
        this.accountId = accountId;
        this.contactId = contactId;
    }
    
    // Getters and Setters
    public Long getDealId() {
        return dealId;
    }
    
    public void setDealId(Long dealId) {
        this.dealId = dealId;
    }
    
    public String getDealName() {
        return dealName;
    }
    
    public void setDealName(String dealName) {
        this.dealName = dealName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public BigDecimal getDealValue() {
        return dealValue;
    }
    
    public void setDealValue(BigDecimal dealValue) {
        this.dealValue = dealValue;
    }
    
    public String getDealStage() {
        return dealStage;
    }
    
    public void setDealStage(String dealStage) {
        this.dealStage = dealStage;
    }
    
    public LocalDateTime getExpectedCloseDate() {
        return expectedCloseDate;
    }
    
    public void setExpectedCloseDate(LocalDateTime expectedCloseDate) {
        this.expectedCloseDate = expectedCloseDate;
    }
    
    public LocalDateTime getActualCloseDate() {
        return actualCloseDate;
    }
    
    public void setActualCloseDate(LocalDateTime actualCloseDate) {
        this.actualCloseDate = actualCloseDate;
    }
    
    public String getProbability() {
        return probability;
    }
    
    public void setProbability(String probability) {
        this.probability = probability;
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
    
    public Long getAccountId() {
        return accountId;
    }
    
    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }
    
    public Long getContactId() {
        return contactId;
    }
    
    public void setContactId(Long contactId) {
        this.contactId = contactId;
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
