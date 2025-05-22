package com.legal.demo.features.documentupload;

import com.legal.demo.domain.legalcase.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {


}
