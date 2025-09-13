package com.crm.repository;

import com.crm.entity.Deal;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {
    List<Deal> findByOrganization(Organization organization);
    List<Deal> findByMember(Member member);
    List<Deal> findByOrganizationAndMember(Organization organization, Member member);
    List<Deal> findByContactsContaining(Contact contact);
    List<Deal> findByOrganizationAndContactsContaining(Organization organization, Contact contact);
}
