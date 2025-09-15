package com.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Entity
@Table(name = "deals")
public class Deal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deal_id")
    private Long dealId;
    
    @NotBlank(message = "Deal name is required")
    @Size(max = 200, message = "Deal name must not exceed 200 characters")
    @Column(name = "deal_name", nullable = false)
    private String dealName;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @DecimalMin(value = "0.0", message = "Deal value must be positive")
    @Column(name = "deal_value", precision = 15, scale = 2)
    private BigDecimal dealValue;
    
    @NotBlank(message = "Deal stage is required")
    @Size(max = 50, message = "Deal stage must not exceed 50 characters")
    @Column(name = "deal_stage", nullable = false)
    private String dealStage;
    
    @Column(name = "expected_close_date")
    private OffsetDateTime expectedCloseDate;
    
    @Column(name = "actual_close_date")
    private OffsetDateTime actualCloseDate;
    
    @Column(name = "probability")
    private String probability;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;
    
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
    private OffsetDateTime createdAt;
    
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now(ZoneOffset.UTC);
        updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now(ZoneOffset.UTC);
    }
    
    // Constructors
    public Deal() {}
    
    public Deal(String dealName, String dealStage, BigDecimal dealValue, Organization organization, Member member) {
        this.dealName = dealName;
        this.dealStage = dealStage;
        this.dealValue = dealValue;
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
    
    public OffsetDateTime getExpectedCloseDate() {
        return expectedCloseDate;
    }
    
    public void setExpectedCloseDate(OffsetDateTime expectedCloseDate) {
        this.expectedCloseDate = expectedCloseDate;
    }
    
    public OffsetDateTime getActualCloseDate() {
        return actualCloseDate;
    }
    
    public void setActualCloseDate(OffsetDateTime actualCloseDate) {
        this.actualCloseDate = actualCloseDate;
    }
    
    public String getProbability() {
        return probability;
    }
    
    public void setProbability(String probability) {
        this.probability = probability;
    }
    
    public Account getAccount() {
        return account;
    }
    
    public void setAccount(Account account) {
        this.account = account;
    }
    
    public Contact getContact() {
        return contact;
    }
    
    public void setContact(Contact contact) {
        this.contact = contact;
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
