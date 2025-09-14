package com.crm.repository;

import com.crm.entity.Account;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByOrganization(Organization organization);
    List<Account> findByMember(Member member);
    List<Account> findByOrganizationAndMember(Organization organization, Member member);
    
    // Custom queries with JOIN FETCH to avoid lazy loading issues
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.organization LEFT JOIN FETCH a.member WHERE a.organization = :organization")
    List<Account> findByOrganizationWithRelations(@Param("organization") Organization organization);
    
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.organization LEFT JOIN FETCH a.member WHERE a.member = :member")
    List<Account> findByMemberWithRelations(@Param("member") Member member);
    
    @Query("SELECT a FROM Account a LEFT JOIN FETCH a.organization LEFT JOIN FETCH a.member WHERE a.accountId = :accountId")
    Account findByIdWithRelations(@Param("accountId") Long accountId);
    
    boolean existsByEmail(String email);
}
