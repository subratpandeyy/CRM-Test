package com.crm.util;

import com.crm.config.JwtConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class AuthenticationUtils {
    
    @Autowired
    private JwtConfig jwtConfig;
    
    public Long getOrgIdFromAuthentication(Authentication authentication, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null) {
            try {
                return jwtConfig.extractOrgId(token);
            } catch (Exception e) {
                // Fallback to default if token extraction fails
                return 1L;
            }
        }
        return 1L; // Default fallback
    }
    
    public Long getMemberIdFromAuthentication(Authentication authentication, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null) {
            try {
                return jwtConfig.extractMemberId(token);
            } catch (Exception e) {
                // Fallback to default if token extraction fails
                return 1L;
            }
        }
        return 1L; // Default fallback
    }
    
    private String extractTokenFromRequest(HttpServletRequest request) {
        final String requestTokenHeader = request.getHeader("Authorization");
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            return requestTokenHeader.substring(7);
        }
        return null;
    }
}

