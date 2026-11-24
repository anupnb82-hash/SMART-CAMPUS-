package com.smartcampus.model;

import java.time.LocalDateTime;

/**
 * Resource Check-In entity for No-Show Detection and Room Utilization Audit.
 */
public class ResourceCheckIn {
    private Long checkinId;
    private Long bookingId;
    private Long userId;
    private LocalDateTime scheduledStart;
    private int gracePeriodMinutes; // default 15 mins
    private LocalDateTime actualCheckinTime;
    private LocalDateTime actualCheckoutTime;
    private boolean isNoShow;
    private LocalDateTime createdAt;

    public ResourceCheckIn() {
        this.gracePeriodMinutes = 15;
        this.isNoShow = false;
        this.createdAt = LocalDateTime.now();
    }

    public boolean hasExceededGracePeriod(LocalDateTime currentTime) {
        if (actualCheckinTime != null) {
            return false;
        }
        LocalDateTime deadline = scheduledStart.plusMinutes(gracePeriodMinutes);
        return currentTime.isAfter(deadline);
    }

    // Getters and Setters
    public Long getCheckinId() { return checkinId; }
    public void setCheckinId(Long checkinId) { this.checkinId = checkinId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getScheduledStart() { return scheduledStart; }
    public void setScheduledStart(LocalDateTime scheduledStart) { this.scheduledStart = scheduledStart; }

    public int getGracePeriodMinutes() { return gracePeriodMinutes; }
    public void setGracePeriodMinutes(int gracePeriodMinutes) { this.gracePeriodMinutes = gracePeriodMinutes; }

    public LocalDateTime getActualCheckinTime() { return actualCheckinTime; }
    public void setActualCheckinTime(LocalDateTime actualCheckinTime) { this.actualCheckinTime = actualCheckinTime; }

    public LocalDateTime getActualCheckoutTime() { return actualCheckoutTime; }
    public void setActualCheckoutTime(LocalDateTime actualCheckoutTime) { this.actualCheckoutTime = actualCheckoutTime; }

    public boolean isNoShow() { return isNoShow; }
    public void setNoShow(boolean noShow) { isNoShow = noShow; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
