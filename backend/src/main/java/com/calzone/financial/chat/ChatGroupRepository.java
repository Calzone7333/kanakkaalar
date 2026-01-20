package com.calzone.financial.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {
    // We can't easily query by member in Set<User> via method name convention
    // easily without complex name
    // But we can use @Query or just filter in service for small scale
    // Or: findByMembers_Email(String email);

    List<ChatGroup> findByMembers_Email(String email);
}
