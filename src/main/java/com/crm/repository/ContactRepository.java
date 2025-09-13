package com.crm.repository;

import com.crm.entity.Contact;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByOrganization(Organization organization);
    List<Contact> findByMember(Member member);
    List<Contact> findByOrganizationAndMember(Organization organization, Member member);
    List<Contact> findByAccount(Account account);
    List<Contact> findByOrganizationAndAccount(Organization organization, Account account);
}
