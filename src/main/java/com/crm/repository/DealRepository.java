package com.crm.repository;

import com.crm.entity.Deal;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {
    List<Deal> findByOrganization(Organization organization);
    List<Deal> findByMember(Member member);
    List<Deal> findByOrganizationAndMember(Organization organization, Member member);
    List<Deal> findByContactsContaining(Contact contact);
    List<Deal> findByOrganizationAndContactsContaining(Organization organization, Contact contact);
    
    // Custom queries with JOIN FETCH to avoid lazy loading issues
    @Query("SELECT d FROM Deal d LEFT JOIN FETCH d.organization LEFT JOIN FETCH d.member LEFT JOIN FETCH d.account LEFT JOIN FETCH d.contact WHERE d.organization = :organization")
    List<Deal> findByOrganizationWithRelations(@Param("organization") Organization organization);
    
    @Query("SELECT d FROM Deal d LEFT JOIN FETCH d.organization LEFT JOIN FETCH d.member LEFT JOIN FETCH d.account LEFT JOIN FETCH d.contact WHERE d.member = :member")
    List<Deal> findByMemberWithRelations(@Param("member") Member member);
    
    @Query("SELECT d FROM Deal d LEFT JOIN FETCH d.organization LEFT JOIN FETCH d.member LEFT JOIN FETCH d.account LEFT JOIN FETCH d.contact WHERE d.dealId = :dealId")
    Deal findByIdWithRelations(@Param("dealId") Long dealId);
}
