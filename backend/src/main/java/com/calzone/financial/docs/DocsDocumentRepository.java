package com.calzone.financial.docs;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocsDocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwnerUserId(Long userId);
}
