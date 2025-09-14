package com.crm.repository;

import com.crm.entity.Contact;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByOrganization(Organization organization);
    List<Contact> findByMember(Member member);
    List<Contact> findByOrganizationAndMember(Organization organization, Member member);
    List<Contact> findByAccount(Account account);
    List<Contact> findByOrganizationAndAccount(Organization organization, Account account);
    
    // Custom queries with JOIN FETCH to avoid lazy loading issues
    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.organization LEFT JOIN FETCH c.member LEFT JOIN FETCH c.account WHERE c.organization = :organization")
    List<Contact> findByOrganizationWithRelations(@Param("organization") Organization organization);
    
    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.organization LEFT JOIN FETCH c.member LEFT JOIN FETCH c.account WHERE c.member = :member")
    List<Contact> findByMemberWithRelations(@Param("member") Member member);
    
    @Query("SELECT c FROM Contact c LEFT JOIN FETCH c.organization LEFT JOIN FETCH c.member LEFT JOIN FETCH c.account WHERE c.contactId = :contactId")
    Contact findByIdWithRelations(@Param("contactId") Long contactId);
}
