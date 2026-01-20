package com.calzone.financial.chat;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(path = "/send", consumes = { "multipart/form-data" })
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestParam("sender") String sender,
            @RequestParam(value = "recipient", required = false) String recipient,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "groupId", required = false) Long groupId,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        String fileName = null;
        String fileType = null;
        byte[] fileData = null;

        try {
            if (file != null && !file.isEmpty()) {
                fileName = file.getOriginalFilename();
                fileType = file.getContentType();
                fileData = file.getBytes();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity
                .ok(chatService.sendMessage(sender, recipient, content, fileName, fileType, fileData, groupId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getHistory(
            @RequestParam String user1,
            @RequestParam String user2) {
        return ResponseEntity.ok(chatService.getChatHistory(user1, user2));
    }

    // --- Group Chat Endpoints ---

    @PostMapping("/groups")
    public ResponseEntity<ChatGroup> createGroup(@RequestBody GroupCreateRequest request) {
        return ResponseEntity.ok(chatService.createGroup(request.getName(), request.getAdmin(), request.getMembers()));
    }

    @GetMapping("/my-groups")
    public ResponseEntity<List<ChatGroup>> getMyGroups(@RequestParam String email) {
        return ResponseEntity.ok(chatService.getUserGroups(email));
    }

    @GetMapping("/group-history")
    public ResponseEntity<List<ChatMessage>> getGroupHistory(@RequestParam Long groupId) {
        return ResponseEntity.ok(chatService.getGroupChatHistory(groupId));
    }
}
