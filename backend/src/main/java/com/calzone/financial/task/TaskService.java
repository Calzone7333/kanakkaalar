package com.calzone.financial.task;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByAssignee(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId);
    }

    @Transactional
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, Map<String, Object> updates) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        
        if (updates.containsKey("title")) task.setTitle((String) updates.get("title"));
        if (updates.containsKey("description")) task.setDescription((String) updates.get("description"));
        if (updates.containsKey("status")) task.setStatus((String) updates.get("status"));
        if (updates.containsKey("priority")) task.setPriority((String) updates.get("priority"));
        if (updates.containsKey("assigneeId")) task.setAssigneeId(((Number) updates.get("assigneeId")).longValue());
        if (updates.containsKey("assigneeName")) task.setAssigneeName((String) updates.get("assigneeName"));
        if (updates.containsKey("dueDate")) {
            Object d = updates.get("dueDate");
            if (d instanceof String) task.setDueDate(java.time.LocalDate.parse((String) d));
        }

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
