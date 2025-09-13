package com.crm.repository;

import com.crm.entity.Activity;
import com.crm.entity.Lead;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByOrganization(Organization organization);
    List<Activity> findByMember(Member member);
    List<Activity> findByOrganizationAndMember(Organization organization, Member member);
    List<Activity> findByLead(Lead lead);
    List<Activity> findByOrganizationAndLead(Organization organization, Lead lead);
}
