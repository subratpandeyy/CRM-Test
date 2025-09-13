package com.crm.repository;

import com.crm.entity.Account;
import com.crm.entity.Member;
import com.crm.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByOrganization(Organization organization);
    List<Account> findByMember(Member member);
    List<Account> findByOrganizationAndMember(Organization organization, Member member);
}
