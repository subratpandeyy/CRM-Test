package com.crm.controller;

import com.crm.dto.MemberDto;
import com.crm.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {
    
    @Autowired
    private MemberService memberService;
    
    @PostMapping
    public ResponseEntity<?> createMember(@Valid @RequestBody MemberDto memberDto) {
        try {
            MemberDto createdMember = memberService.createMember(memberDto);
            return ResponseEntity.ok(createdMember);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllMembers() {
        try {
            List<MemberDto> members = memberService.getAllMembers();
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{memberId}")
    public ResponseEntity<?> getMemberById(@PathVariable Long memberId) {
        try {
            MemberDto member = memberService.getMemberById(memberId);
            return ResponseEntity.ok(member);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{memberId}")
    public ResponseEntity<?> updateMember(@PathVariable Long memberId, @Valid @RequestBody MemberDto memberDto) {
        try {
            MemberDto updatedMember = memberService.updateMember(memberId, memberDto);
            return ResponseEntity.ok(updatedMember);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{memberId}")
    public ResponseEntity<?> deleteMember(@PathVariable Long memberId) {
        try {
            memberService.deleteMember(memberId);
            return ResponseEntity.ok("Member deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
