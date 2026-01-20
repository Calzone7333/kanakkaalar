package com.calzone.financial.chat;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderEmail;
    private String recipientEmail; // 'ADMIN' for messages to admin

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp;

    private boolean isRead;

    // File Sharing Fields
    private String fileName;

    private String fileType;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileData;

    // Group Chat Field (null for 1-on-1)
    private Long groupId;
}
