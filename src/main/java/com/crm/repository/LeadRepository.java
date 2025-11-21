package com.crm.repository;

import com.crm.entity.Lead;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByOrganization(Organization organization);
    List<Lead> findByMember(Member member);
    List<Lead> findByOrganizationAndMember(Organization organization, Member member);
    List<Lead> findByOrganizationAndIsVerified(Organization organization, Boolean isVerified);
    
    // Custom queries with JOIN FETCH to avoid lazy loading issues
    @Query("SELECT l FROM Lead l LEFT JOIN FETCH l.organization LEFT JOIN FETCH l.member WHERE l.organization = :organization")
    List<Lead> findByOrganizationWithRelations(@Param("organization") Organization organization);
    
    @Query("SELECT l FROM Lead l LEFT JOIN FETCH l.organization LEFT JOIN FETCH l.member WHERE l.member = :member")
    List<Lead> findByMemberWithRelations(@Param("member") Member member);
    
    @Query("SELECT l FROM Lead l LEFT JOIN FETCH l.organization LEFT JOIN FETCH l.member WHERE l.leadId = :leadId")
    Lead findByIdWithRelations(@Param("leadId") Long leadId);

    @Query("""
    SELECT 
        YEAR(l.createdAt) AS year,
        MONTH(l.createdAt) AS month,
        COUNT(l.id) AS leadCount
    FROM Lead l
    WHERE l.organization = :organization
    GROUP BY YEAR(l.createdAt), MONTH(l.createdAt)
    ORDER BY YEAR(l.createdAt), MONTH(l.createdAt)
""")
List<Object[]> findMonthlyLeadSummaryByOrganization(@Param("organization") Organization organization);

}
