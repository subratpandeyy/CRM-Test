package com.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "deals")
public class Deal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deal_id")
    private Long dealId;
    
    @NotBlank(message = "Deal title is required")
    @Size(max = 200, message = "Deal title must not exceed 200 characters")
    @Column(name = "title", nullable = false)
    private String title;
    
    @NotBlank(message = "Deal stage is required")
    @Size(max = 50, message = "Deal stage must not exceed 50 characters")
    @Column(name = "stage", nullable = false)
    private String stage;
    
    @DecimalMin(value = "0.0", message = "Deal value must be positive")
    @Column(name = "value", precision = 15, scale = 2)
    private BigDecimal value;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private Organization organization;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "deal_contacts",
        joinColumns = @JoinColumn(name = "deal_id"),
        inverseJoinColumns = @JoinColumn(name = "contact_id")
    )
    private List<Contact> contacts;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors
    public Deal() {}
    
    public Deal(String title, String stage, BigDecimal value, Organization organization, Member member) {
        this.title = title;
        this.stage = stage;
        this.value = value;
        this.organization = organization;
        this.member = member;
    }
    
    // Getters and Setters
    public Long getDealId() {
        return dealId;
    }
    
    public void setDealId(Long dealId) {
        this.dealId = dealId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getStage() {
        return stage;
    }
    
    public void setStage(String stage) {
        this.stage = stage;
    }
    
    public BigDecimal getValue() {
        return value;
    }
    
    public void setValue(BigDecimal value) {
        this.value = value;
    }
    
    public Organization getOrganization() {
        return organization;
    }
    
    public void setOrganization(Organization organization) {
        this.organization = organization;
    }
    
    public Member getMember() {
        return member;
    }
    
    public void setMember(Member member) {
        this.member = member;
    }
    
    public List<Contact> getContacts() {
        return contacts;
    }
    
    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
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
