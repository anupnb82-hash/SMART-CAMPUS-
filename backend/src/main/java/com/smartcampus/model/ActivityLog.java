package com.smartcampus.model;

import java.time.LocalDateTime;

/**
 * Activity Log entity for campus audit trails and system activity history.
 */
public class ActivityLog {
    private Long logId;
    private Long userId;
    private String userName;
    private String actionType;
    private String module;
    private String details;
    private String ipAddress;
    private LocalDateTime createdAt;

    public ActivityLog() {
        this.createdAt = LocalDateTime.now();
        this.ipAddress = "127.0.0.1";
    }

    public ActivityLog(Long userId, String actionType, String module, String details) {
        this();
        this.userId = userId;
        this.actionType = actionType;
        this.module = module;
        this.details = details;
    }

    // Getters and Setters
    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
