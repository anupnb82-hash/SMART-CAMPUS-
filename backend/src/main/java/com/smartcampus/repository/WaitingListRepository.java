package com.smartcampus.repository;

import com.smartcampus.model.WaitingListEntry;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Time;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class WaitingListRepository {

    private final JdbcTemplate jdbcTemplate;

    public WaitingListRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<WaitingListEntry> waitingListRowMapper = (rs, rowNum) -> {
        WaitingListEntry w = new WaitingListEntry();
        w.setWaitId(rs.getLong("wait_id"));
        w.setUserId(rs.getLong("user_id"));
        w.setUserName(rs.getString("username"));
        w.setUserRole(rs.getString("role"));
        w.setResourceType(rs.getString("resource_type"));
        w.setResourceId(rs.getLong("resource_id"));
        w.setRequestedDate(rs.getDate("requested_date").toLocalDate());
        w.setPreferredStartTime(rs.getTime("preferred_start_time").toLocalTime());
        w.setPreferredEndTime(rs.getTime("preferred_end_time").toLocalTime());
        w.setPurpose(rs.getString("purpose"));
        w.setPriority(rs.getInt("priority"));
        w.setAutoAllocateOptIn(rs.getBoolean("auto_allocate_opt_in"));
        w.setStatus(rs.getString("status"));
        w.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return w;
    };

    public List<WaitingListEntry> findAll() {
        String sql = """
            SELECT w.wait_id, w.user_id, u.username, u.role, w.resource_type,
                   w.resource_id, w.requested_date, w.preferred_start_time,
                   w.preferred_end_time, w.purpose, w.priority, w.auto_allocate_opt_in,
                   w.status, w.created_at
            FROM waiting_list w
            JOIN users u ON w.user_id = u.user_id
            ORDER BY w.priority DESC, w.created_at ASC
        """;
        return jdbcTemplate.query(sql, waitingListRowMapper);
    }

    public List<WaitingListEntry> findActiveByResourceAndDate(String resourceType, Long resourceId, LocalDate date) {
        String sql = """
            SELECT w.wait_id, w.user_id, u.username, u.role, w.resource_type,
                   w.resource_id, w.requested_date, w.preferred_start_time,
                   w.preferred_end_time, w.purpose, w.priority, w.auto_allocate_opt_in,
                   w.status, w.created_at
            FROM waiting_list w
            JOIN users u ON w.user_id = u.user_id
            WHERE w.resource_type = ?
              AND w.resource_id = ?
              AND w.requested_date = ?
              AND w.status = 'WAITING'
            ORDER BY w.priority DESC, w.created_at ASC
        """;
        return jdbcTemplate.query(sql, waitingListRowMapper, resourceType, resourceId, Date.valueOf(date));
    }

    public Optional<WaitingListEntry> findById(Long waitId) {
        String sql = """
            SELECT w.wait_id, w.user_id, u.username, u.role, w.resource_type,
                   w.resource_id, w.requested_date, w.preferred_start_time,
                   w.preferred_end_time, w.purpose, w.priority, w.auto_allocate_opt_in,
                   w.status, w.created_at
            FROM waiting_list w
            JOIN users u ON w.user_id = u.user_id
            WHERE w.wait_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, waitingListRowMapper, waitId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long save(WaitingListEntry entry) {
        String sql = "INSERT INTO waiting_list (user_id, resource_type, resource_id, requested_date, preferred_start_time, preferred_end_time, purpose, priority, auto_allocate_opt_in, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, entry.getUserId());
            ps.setString(2, entry.getResourceType());
            ps.setLong(3, entry.getResourceId());
            ps.setDate(4, Date.valueOf(entry.getRequestedDate()));
            ps.setTime(5, Time.valueOf(entry.getPreferredStartTime()));
            ps.setTime(6, Time.valueOf(entry.getPreferredEndTime()));
            ps.setString(7, entry.getPurpose());
            ps.setInt(8, entry.getPriority());
            ps.setBoolean(9, entry.isAutoAllocateOptIn());
            ps.setString(10, entry.getStatus());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean updateStatus(Long waitId, String status) {
        String sql = "UPDATE waiting_list SET status = ? WHERE wait_id = ?";
        return jdbcTemplate.update(sql, status, waitId) > 0;
    }

    public long countActive() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM waiting_list WHERE status = 'WAITING'", Long.class);
    }
}
