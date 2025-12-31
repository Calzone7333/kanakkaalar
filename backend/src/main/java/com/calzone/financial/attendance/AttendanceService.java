package com.calzone.financial.attendance;

import com.calzone.financial.user.User;
import com.calzone.financial.user.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    public Attendance checkIn(Long userId, String location) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate today = LocalDate.now();
        
        Optional<Attendance> existing = attendanceRepository.findByUserIdAndDate(userId, today);
        if (existing.isPresent()) {
            return existing.get(); // Already checked in
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(today);
        LocalDateTime checkInTime = LocalDateTime.now();
        attendance.setCheckInTime(checkInTime);
        attendance.setLocation(location);
        
        // Check if late (after 9:30 AM)
        LocalDateTime officeStartTime = today.atTime(9, 30);
        LocalDateTime lateThreshold = today.atTime(9, 45);
        
        if (checkInTime.isAfter(lateThreshold)) {
            attendance.setStatus("Late");
        } else {
            attendance.setStatus("Present");
        }
        
        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(Long userId) {
        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByUserIdAndDate(userId, today)
                .orElseThrow(() -> new RuntimeException("No check-in record found for today"));
        
        attendance.setCheckOutTime(LocalDateTime.now());
        
        // Calculate duration
        Duration duration = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime());
        long hours = duration.toHours();
        long minutes = duration.toMinutesPart();
        attendance.setDuration(String.format("%dh %02dm", hours, minutes));
        
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getMyAttendance(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
    
    public Attendance getTodayAttendance(Long userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now()).orElse(null);
    }
    
    public java.util.Map<String, Object> getAttendanceStats() {
        LocalDate today = LocalDate.now();
        List<Attendance> todayRecords = attendanceRepository.findByDate(today);
        
        long present = todayRecords.stream().filter(a -> "Present".equals(a.getStatus())).count();
        long late = todayRecords.stream().filter(a -> "Late".equals(a.getStatus())).count();
        long absent = todayRecords.stream().filter(a -> "Absent".equals(a.getStatus())).count();
        
        double attendanceRate = 0.0;
        if (!todayRecords.isEmpty()) {
            attendanceRate = ((double)(present + late) / todayRecords.size()) * 100;
        }
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("present", present);
        stats.put("late", late);
        stats.put("absent", absent);
        stats.put("attendanceRate", String.format("%.1f", attendanceRate));
        
        return stats;
    }
    
    public List<java.util.Map<String, Object>> getAttendanceTrend() {
        List<java.util.Map<String, Object>> trend = new java.util.ArrayList<>();
        LocalDate today = LocalDate.now();
        
        // Get last 4 weeks data
        for (int week = 3; week >= 0; week--) {
            LocalDate weekStart = today.minusWeeks(week).with(java.time.DayOfWeek.MONDAY);
            LocalDate weekEnd = weekStart.plusDays(6);
            
            List<Attendance> weekRecords = attendanceRepository.findAll().stream()
                .filter(a -> !a.getDate().isBefore(weekStart) && !a.getDate().isAfter(weekEnd))
                .collect(java.util.stream.Collectors.toList());
            
            long present = weekRecords.stream().filter(a -> "Present".equals(a.getStatus())).count();
            long late = weekRecords.stream().filter(a -> "Late".equals(a.getStatus())).count();
            long absent = weekRecords.stream().filter(a -> "Absent".equals(a.getStatus())).count();
            
            java.util.Map<String, Object> weekData = new java.util.HashMap<>();
            weekData.put("week", "Week " + (4 - week));
            weekData.put("present", present);
            weekData.put("late", late);
            weekData.put("absent", absent);
            
            trend.add(weekData);
        }
        
        return trend;
    }
}
