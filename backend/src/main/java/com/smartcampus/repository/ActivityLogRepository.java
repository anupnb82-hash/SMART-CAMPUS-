package com.smartcampus.repository;

import com.smartcampus.model.ActivityLog;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ActivityLogRepository {

    private final JdbcTemplate jdbcTemplate;

    public ActivityLogRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ActivityLog> logRowMapper = (rs, rowNum) -> {
        ActivityLog log = new ActivityLog();
        log.setLogId(rs.getLong("log_id"));
        log.setUserId(rs.getObject("user_id") != null ? rs.getLong("user_id") : null);
        log.setUserName(rs.getString("username"));
        log.setActionType(rs.getString("action_type"));
        log.setModule(rs.getString("module"));
        log.setDetails(rs.getString("details"));
        log.setIpAddress(rs.getString("ip_address"));
        log.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return log;
    };

    public List<ActivityLog> findRecent(int limit) {
        String sql = """
            SELECT l.log_id, l.user_id, COALESCE(u.username, 'SYSTEM') AS username,
                   l.action_type, l.module, l.details, l.ip_address, l.created_at
            FROM activity_logs l
            LEFT JOIN users u ON l.user_id = u.user_id
            ORDER BY l.created_at DESC
            LIMIT ?
        """;
        return jdbcTemplate.query(sql, logRowMapper, limit);
    }

    public void log(Long userId, String actionType, String module, String details) {
        String sql = "INSERT INTO activity_logs (user_id, action_type, module, details, ip_address) VALUES (?, ?, ?, ?, '127.0.0.1')";
        jdbcTemplate.update(sql, userId, actionType, module, details);
    }
}
