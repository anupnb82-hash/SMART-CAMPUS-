package com.smartcampus.repository;

import com.smartcampus.model.Notification;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class NotificationRepository {

    private final JdbcTemplate jdbcTemplate;

    public NotificationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Notification> notificationRowMapper = (rs, rowNum) -> {
        Notification n = new Notification();
        n.setNotificationId(rs.getLong("notification_id"));
        n.setUserId(rs.getLong("user_id"));
        n.setTitle(rs.getString("title"));
        n.setMessage(rs.getString("message"));
        n.setType(rs.getString("type"));
        n.setRead(rs.getBoolean("is_read"));
        n.setActionUrl(rs.getString("action_url"));
        n.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return n;
    };

    public List<Notification> findByUserId(Long userId) {
        String sql = "SELECT notification_id, user_id, title, message, type, is_read, action_url, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper, userId);
    }

    public Long save(Notification n) {
        String sql = "INSERT INTO notifications (user_id, title, message, type, is_read, action_url) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, n.getUserId());
            ps.setString(2, n.getTitle());
            ps.setString(3, n.getMessage());
            ps.setString(4, n.getType());
            ps.setBoolean(5, n.isRead());
            ps.setString(6, n.getActionUrl());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean markAsRead(Long notificationId) {
        return jdbcTemplate.update("UPDATE notifications SET is_read = TRUE WHERE notification_id = ?", notificationId) > 0;
    }

    public boolean markAllAsRead(Long userId) {
        return jdbcTemplate.update("UPDATE notifications SET is_read = TRUE WHERE user_id = ?", userId) > 0;
    }

    public long countUnread(Long userId) {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE", Long.class, userId);
    }
}
