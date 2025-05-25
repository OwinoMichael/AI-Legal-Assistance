package com.legal.demo.features.casecreation;

import com.legal.demo.domain.legalcase.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CaseRepository extends JpaRepository<Case, Integer> {

    boolean existsByTitle(String title);
}
