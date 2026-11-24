package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.DashboardStatsResponse;
import com.smartcampus.model.ActivityLog;
import com.smartcampus.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok("Live campus database statistics", dashboardService.getAdminDashboardStats()));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<List<ActivityLog>>> getRecentActivity(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.ok("Recent system activities", dashboardService.getRecentActivities(limit)));
    }
}
