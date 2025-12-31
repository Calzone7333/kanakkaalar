package com.calzone.financial.attendance;

import com.calzone.financial.auth.AuthService;
import com.calzone.financial.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final AuthService authService;

    public AttendanceController(AttendanceService attendanceService, AuthService authService) {
        this.attendanceService = attendanceService;
        this.authService = authService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(@RequestBody Map<String, String> payload) {
        User user = authService.getCurrentUser();
        String location = payload.getOrDefault("location", "Unknown");
        return ResponseEntity.ok(attendanceService.checkIn(user.getId(), location));
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(attendanceService.checkOut(user.getId()));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<Attendance>> getMyHistory() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(attendanceService.getMyAttendance(user.getId()));
    }
    
    @GetMapping("/today")
    public ResponseEntity<Attendance> getToday() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(attendanceService.getTodayAttendance(user.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }
    
    @GetMapping("/stats")
    public ResponseEntity<java.util.Map<String, Object>> getStats() {
        return ResponseEntity.ok(attendanceService.getAttendanceStats());
    }
    
    @GetMapping("/trend")
    public ResponseEntity<List<java.util.Map<String, Object>>> getTrend() {
        return ResponseEntity.ok(attendanceService.getAttendanceTrend());
    }
}
