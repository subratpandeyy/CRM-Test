package com.crm.repository;

import com.crm.entity.Activity;
import com.crm.entity.Lead;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Account;
import com.crm.entity.Contact;
import com.crm.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByOrganization(Organization organization);
    List<Activity> findByMember(Member member);
    List<Activity> findByOrganizationAndMember(Organization organization, Member member);
    List<Activity> findByLead(Lead lead);
    List<Activity> findByOrganizationAndLead(Organization organization, Lead lead);
    
    // Custom queries with JOIN FETCH to avoid lazy loading issues
    @Query("SELECT a FROM Activity a LEFT JOIN FETCH a.organization LEFT JOIN FETCH a.member LEFT JOIN FETCH a.account LEFT JOIN FETCH a.contact LEFT JOIN FETCH a.deal LEFT JOIN FETCH a.lead WHERE a.organization = :organization")
    List<Activity> findByOrganizationWithRelations(@Param("organization") Organization organization);
    
    @Query("SELECT a FROM Activity a LEFT JOIN FETCH a.organization LEFT JOIN FETCH a.member LEFT JOIN FETCH a.account LEFT JOIN FETCH a.contact LEFT JOIN FETCH a.deal LEFT JOIN FETCH a.lead WHERE a.member = :member")
    List<Activity> findByMemberWithRelations(@Param("member") Member member);
    
    @Query("SELECT a FROM Activity a LEFT JOIN FETCH a.organization LEFT JOIN FETCH a.member LEFT JOIN FETCH a.account LEFT JOIN FETCH a.contact LEFT JOIN FETCH a.deal LEFT JOIN FETCH a.lead WHERE a.activityId = :activityId")
    Activity findByIdWithRelations(@Param("activityId") Long activityId);
}
