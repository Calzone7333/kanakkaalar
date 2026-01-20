package com.calzone.financial.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Find chat history between two users (or user and ADMIN)
    // We want messages where (sender=A AND recipient=B) OR (sender=B AND
    // recipient=A)
    List<ChatMessage> findBySenderEmailAndRecipientEmailOrSenderEmailAndRecipientEmailOrderByTimestampAsc(
            String sender1, String recipient1, String sender2, String recipient2);

    // Find all messages involving a specific user (for Admin view)
    List<ChatMessage> findBySenderEmailOrRecipientEmailOrderByTimestampDesc(String email1, String email2);

    // Group Chat History
    List<ChatMessage> findByGroupIdOrderByTimestampAsc(Long groupId);
}
