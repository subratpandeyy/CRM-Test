package com.crm.repository;

import com.crm.entity.Lead;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByOrganization(Organization organization);
    List<Lead> findByMember(Member member);
    List<Lead> findByOrganizationAndMember(Organization organization, Member member);
    List<Lead> findByOrganizationAndIsVerified(Organization organization, Boolean isVerified);
}
