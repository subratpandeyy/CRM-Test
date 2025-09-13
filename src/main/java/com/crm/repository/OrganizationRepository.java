package com.crm.repository;

import com.crm.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByOrgEmail(String orgEmail);
    boolean existsByOrgEmail(String orgEmail);
}
