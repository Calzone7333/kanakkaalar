package com.calzone.financial.chat;

import com.calzone.financial.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chat_groups")
@Data
@NoArgsConstructor
public class ChatGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "chat_group_members", joinColumns = @JoinColumn(name = "group_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> members = new HashSet<>();

    private String adminEmail;

    private LocalDateTime createdAt = LocalDateTime.now();

    public void addMember(User user) {
        this.members.add(user);
    }
}
