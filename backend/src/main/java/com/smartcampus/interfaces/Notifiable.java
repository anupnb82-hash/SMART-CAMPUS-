package com.smartcampus.interfaces;

/**
 * Interface representing dispatchable alert messages, offers, and deadlines.
 */
public interface Notifiable {
    Long getRecipientUserId();
    String getNotificationTitle();
    String getNotificationBody();
    String getChannelType();
    boolean isUrgent();
}
