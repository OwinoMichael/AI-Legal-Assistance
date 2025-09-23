package com.legal.demo.features.casecreation;

import com.legal.demo.domain.legalcase.Case;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseRepository extends JpaRepository<Case, Integer> {

    boolean existsByTitle(String title);

    @Query("SELECT c FROM Case c WHERE c.user.id = :userId")
    Page<Case> findByUser_Id(String userId, Pageable pageable);
}
