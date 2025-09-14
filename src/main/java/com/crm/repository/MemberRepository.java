package com.crm.repository;

import com.crm.entity.Member;
import com.crm.entity.Organization;
import com.crm.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    
    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.role LEFT JOIN FETCH m.organization WHERE m.email = :email")
    Optional<Member> findByEmailWithRoleAndOrganization(@Param("email") String email);
    
    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.role LEFT JOIN FETCH m.organization WHERE m.organization = :organization")
    List<Member> findByOrganizationWithRelations(@Param("organization") Organization organization);
    
    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.role LEFT JOIN FETCH m.organization")
    List<Member> findAllWithRelations();
    
    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.role LEFT JOIN FETCH m.organization WHERE m.memberId = :memberId")
    Member findByIdWithRelations(@Param("memberId") Long memberId);
    
    @Query(value = "SELECT m.member_id, m.email, m.name, m.password, m.status, o.org_id, o.org_name, r.role_name " +
                   "FROM members m " +
                   "LEFT JOIN organizations o ON m.org_id = o.org_id " +
                   "LEFT JOIN roles r ON m.role_id = r.role_id " +
                   "WHERE m.email = :email", nativeQuery = true)
    Optional<Object[]> findUserDataForAuth(@Param("email") String email);
    
    boolean existsByEmail(String email);
    List<Member> findByOrganization(Organization organization);
    List<Member> findByOrganizationAndStatus(Organization organization, Member.MemberStatus status);
    List<Member> findByRole(Role role);
    Optional<Member> findByEmailAndOrganization(String email, Organization organization);
}
