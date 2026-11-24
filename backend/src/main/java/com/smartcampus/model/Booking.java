package com.smartcampus.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Booking entity representing a confirmed or pending resource reservation.
 */
public class Booking {
    private Long bookingId;
    private Long userId;
    private String userName;
    private String userRole;
    private String resourceType; // CLASSROOM, LABORATORY, EQUIPMENT
    private Long resourceId;
    private String resourceName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private String status; // PENDING, CONFIRMED, CANCELLED, REJECTED, COMPLETED, NO_SHOW
    private String checkInStatus; // NOT_CHECKED_IN, CHECKED_IN, EXPIRED_NO_SHOW
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Booking() {
        this.status = "CONFIRMED";
        this.checkInStatus = "NOT_CHECKED_IN";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Booking(Long bookingId, Long userId, String resourceType, Long resourceId,
                   LocalDate bookingDate, LocalTime startTime, LocalTime endTime, String purpose) {
        this();
        this.bookingId = bookingId;
        this.userId = userId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
    }

    // Overlap detection method
    public boolean overlapsWith(LocalDate date, LocalTime start, LocalTime end) {
        if (!this.bookingDate.equals(date)) {
            return false;
        }
        if ("CANCELLED".equalsIgnoreCase(this.status) || "REJECTED".equalsIgnoreCase(this.status)) {
            return false;
        }
        // Overlap condition: start < otherEnd AND end > otherStart
        return this.startTime.isBefore(end) && this.endTime.isAfter(start);
    }

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

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

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCheckInStatus() { return checkInStatus; }
    public void setCheckInStatus(String checkInStatus) { this.checkInStatus = checkInStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
