package com.crm.dto;

public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private Long memberId;
    private String email;
    private String name;
    private Long orgId;
    private String orgName;
    private String role;
    
    // Constructors
    public JwtResponse() {}
    
    public JwtResponse(String token, Long memberId, String email, String name, Long orgId, String orgName, String role) {
        this.token = token;
        this.memberId = memberId;
        this.email = email;
        this.name = name;
        this.orgId = orgId;
        this.orgName = orgName;
        this.role = role;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Long getMemberId() {
        return memberId;
    }
    
    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
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
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}
