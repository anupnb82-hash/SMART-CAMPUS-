package com.smartcampus.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Waiting List Entry for the Campus Resource Rescue Engine.
 * 
 * Demonstrates:
 * - OOP Collections & PriorityQueue: Implements Comparable for intelligent slot priority ordering
 * - Fair allocation: High priority first, then earliest timestamp (FIFO)
 */
public class WaitingListEntry implements Comparable<WaitingListEntry> {
    private Long waitId;
    private Long userId;
    private String userName;
    private String userRole;
    private String resourceType;
    private Long resourceId;
    private String resourceName;
    private LocalDate requestedDate;
    private LocalTime preferredStartTime;
    private LocalTime preferredEndTime;
    private String purpose;
    private int priority; // 3: Urgent / Exam, 2: Faculty Research, 1: Normal
    private boolean autoAllocateOptIn;
    private String status; // WAITING, OFFERED, ALLOCATED, EXPIRED, CANCELLED
    private LocalDateTime createdAt;

    public WaitingListEntry() {
        this.priority = 1;
        this.autoAllocateOptIn = true;
        this.status = "WAITING";
        this.createdAt = LocalDateTime.now();
    }

    public WaitingListEntry(Long waitId, Long userId, String resourceType, Long resourceId,
                            LocalDate requestedDate, LocalTime preferredStartTime, 
                            LocalTime preferredEndTime, String purpose, int priority) {
        this();
        this.waitId = waitId;
        this.userId = userId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.requestedDate = requestedDate;
        this.preferredStartTime = preferredStartTime;
        this.preferredEndTime = preferredEndTime;
        this.purpose = purpose;
        this.priority = priority;
    }

    /**
     * Comparable implementation for PriorityQueue ranking:
     * Higher priority number comes first (-1).
     * If priority is identical, earlier createdAt timestamp comes first.
     */
    @Override
    public int compareTo(WaitingListEntry other) {
        if (other == null) return -1;
        if (this.priority != other.priority) {
            return Integer.compare(other.priority, this.priority); // Descending priority
        }
        return this.createdAt.compareTo(other.createdAt); // Ascending timestamp (FIFO)
    }

    // Compatibility check with released time slot
    public boolean isCompatibleWithSlot(LocalDate date, LocalTime slotStart, LocalTime slotEnd) {
        if (!this.requestedDate.equals(date)) {
            return false;
        }
        // Slot must cover the preferred time or be within requested bounds
        return !this.preferredStartTime.isBefore(slotStart) && !this.preferredEndTime.isAfter(slotEnd);
    }

    // Getters and Setters
    public Long getWaitId() { return waitId; }
    public void setWaitId(Long waitId) { this.waitId = waitId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public String getResourceName() { return resourceName; }
    public void setResourceName(String resourceName) { this.resourceName = resourceName; }

    public LocalDate getRequestedDate() { return requestedDate; }
    public void setRequestedDate(LocalDate requestedDate) { this.requestedDate = requestedDate; }

    public LocalTime getPreferredStartTime() { return preferredStartTime; }
    public void setPreferredStartTime(LocalTime preferredStartTime) { this.preferredStartTime = preferredStartTime; }

    public LocalTime getPreferredEndTime() { return preferredEndTime; }
    public void setPreferredEndTime(LocalTime preferredEndTime) { this.preferredEndTime = preferredEndTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }

    public boolean isAutoAllocateOptIn() { return autoAllocateOptIn; }
    public void setAutoAllocateOptIn(boolean autoAllocateOptIn) { this.autoAllocateOptIn = autoAllocateOptIn; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
