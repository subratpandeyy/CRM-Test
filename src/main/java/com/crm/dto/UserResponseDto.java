package com.crm.dto;

public class UserResponseDto {
    private Long id;
    private String email;
    private String roleName;
    private String jwtToken;
    
    // Constructors
    public UserResponseDto() {}
    
    public UserResponseDto(Long id, String email, String roleName, String jwtToken) {
        this.id = id;
        this.email = email;
        this.roleName = roleName;
        this.jwtToken = jwtToken;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRoleName() {
        return roleName;
    }
    
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    
    public String getJwtToken() {
        return jwtToken;
    }
    
    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }
}
