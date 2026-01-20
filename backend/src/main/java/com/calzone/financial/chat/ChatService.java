package com.calzone.financial.chat;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatGroupRepository chatGroupRepository;
    private final com.calzone.financial.user.UserRepository userRepository;

    public ChatService(ChatMessageRepository chatMessageRepository,
            ChatGroupRepository chatGroupRepository,
            com.calzone.financial.user.UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatGroupRepository = chatGroupRepository;
        this.userRepository = userRepository;
    }

    public ChatMessage sendMessage(String senderEmail, String recipientEmail, String content, String fileName,
            String fileType, byte[] fileData, Long groupId) {
        ChatMessage message = new ChatMessage();
        message.setSenderEmail(senderEmail);
        message.setRecipientEmail(recipientEmail);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);
        message.setGroupId(groupId);

        // File Handling
        if (fileName != null && fileData != null) {
            message.setFileName(fileName);
            message.setFileType(fileType);
            message.setFileData(fileData);
        }

        return chatMessageRepository.save(message);
    }

    // Create a group
    @Transactional
    public ChatGroup createGroup(String name, String adminEmail, List<String> memberEmails) {
        ChatGroup group = new ChatGroup();
        group.setName(name);
        group.setAdminEmail(adminEmail);

        // Add Admin
        userRepository.findByEmail(adminEmail).ifPresent(group::addMember);

        // Add others
        for (String email : memberEmails) {
            userRepository.findByEmail(email).ifPresent(group::addMember);
        }

        return chatGroupRepository.save(group);
    }

    // Get groups for a user
    public List<ChatGroup> getUserGroups(String userEmail) {
        return chatGroupRepository.findByMembers_Email(userEmail);
    }

    public List<ChatMessage> getChatHistory(String userEmail, String otherPartyEmail) {
        return chatMessageRepository
                .findBySenderEmailAndRecipientEmailOrSenderEmailAndRecipientEmailOrderByTimestampAsc(
                        userEmail, otherPartyEmail, otherPartyEmail, userEmail);
    }

    public List<ChatMessage> getGroupChatHistory(Long groupId) {
        return chatMessageRepository.findByGroupIdOrderByTimestampAsc(groupId);
    }
}
