package com.smartcampus.model;

import com.smartcampus.interfaces.Notifiable;
import java.time.LocalDateTime;

/**
 * Notification entity implementing Notifiable interface.
 */
public class Notification implements Notifiable {
    private Long notificationId;
    private Long userId;
    private String title;
    private String message;
    private String type; // BOOKING, WAITLIST_OFFER, ASSIGNMENT, EVENT, SYSTEM
    private boolean isRead;
    private String actionUrl;
    private LocalDateTime createdAt;

    public Notification() {
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    public Notification(Long userId, String title, String message, String type, String actionUrl) {
        this();
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.actionUrl = actionUrl;
    }

    @Override
    public Long getRecipientUserId() { return userId; }

    @Override
    public String getNotificationTitle() { return title; }

    @Override
    public String getNotificationBody() { return message; }

    @Override
    public String getChannelType() { return type; }

    @Override
    public boolean isUrgent() {
        return "WAITLIST_OFFER".equalsIgnoreCase(type) || "SYSTEM".equalsIgnoreCase(type);
    }

    // Getters and Setters
    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
