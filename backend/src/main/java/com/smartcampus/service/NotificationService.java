package com.smartcampus.service;

import com.smartcampus.model.Notification;
import com.smartcampus.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public Notification sendNotification(Long userId, String title, String message, String type, String actionUrl) {
        Notification n = new Notification(userId, title, message, type, actionUrl);
        Long id = notificationRepository.save(n);
        n.setNotificationId(id);
        return n;
    }

    public boolean markAsRead(Long notificationId) {
        return notificationRepository.markAsRead(notificationId);
    }

    public boolean markAllAsRead(Long userId) {
        return notificationRepository.markAllAsRead(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnread(userId);
    }
}
