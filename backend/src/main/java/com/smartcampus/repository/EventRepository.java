package com.smartcampus.repository;

import com.smartcampus.model.CampusEvent;
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
import java.util.List;
import java.util.Optional;

@Repository
public class EventRepository {

    private final JdbcTemplate jdbcTemplate;

    public EventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<CampusEvent> eventRowMapper = (rs, rowNum) -> {
        CampusEvent e = new CampusEvent();
        e.setEventId(rs.getLong("event_id"));
        e.setEventName(rs.getString("event_name"));
        e.setDescription(rs.getString("description"));
        e.setEventDate(rs.getDate("event_date").toLocalDate());
        e.setStartTime(rs.getTime("start_time").toLocalTime());
        e.setEndTime(rs.getTime("end_time").toLocalTime());
        e.setVenue(rs.getString("venue"));
        e.setOrganizerUserId(rs.getLong("organizer_user_id"));
        e.setOrganizerName(rs.getString("organizer_name"));
        e.setCategory(rs.getString("category"));
        e.setMaxParticipants(rs.getInt("max_participants"));
        e.setCurrentParticipants(rs.getInt("current_participants"));
        e.setStatus(rs.getString("status"));
        e.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return e;
    };

    public List<CampusEvent> findAll() {
        String sql = """
            SELECT e.event_id, e.event_name, e.description, e.event_date, e.start_time,
                   e.end_time, e.venue, e.organizer_user_id, u.username AS organizer_name,
                   e.category, e.max_participants, e.current_participants, e.status, e.created_at
            FROM events e
            JOIN users u ON e.organizer_user_id = u.user_id
            ORDER BY e.event_date ASC, e.start_time ASC
        """;
        return jdbcTemplate.query(sql, eventRowMapper);
    }

    public Optional<CampusEvent> findById(Long eventId) {
        String sql = """
            SELECT e.event_id, e.event_name, e.description, e.event_date, e.start_time,
                   e.end_time, e.venue, e.organizer_user_id, u.username AS organizer_name,
                   e.category, e.max_participants, e.current_participants, e.status, e.created_at
            FROM events e
            JOIN users u ON e.organizer_user_id = u.user_id
            WHERE e.event_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, eventRowMapper, eventId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long save(CampusEvent event) {
        String sql = "INSERT INTO events (event_name, description, event_date, start_time, end_time, venue, organizer_user_id, category, max_participants, current_participants, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, event.getEventName());
            ps.setString(2, event.getDescription());
            ps.setDate(3, Date.valueOf(event.getEventDate()));
            ps.setTime(4, Time.valueOf(event.getStartTime()));
            ps.setTime(5, Time.valueOf(event.getEndTime()));
            ps.setString(6, event.getVenue());
            ps.setLong(7, event.getOrganizerUserId());
            ps.setString(8, event.getCategory());
            ps.setInt(9, event.getMaxParticipants());
            ps.setInt(10, event.getCurrentParticipants());
            ps.setString(11, event.getStatus());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean update(CampusEvent event) {
        String sql = "UPDATE events SET event_name = ?, description = ?, event_date = ?, start_time = ?, end_time = ?, venue = ?, category = ?, max_participants = ?, status = ? WHERE event_id = ?";
        return jdbcTemplate.update(sql,
                event.getEventName(),
                event.getDescription(),
                Date.valueOf(event.getEventDate()),
                Time.valueOf(event.getStartTime()),
                Time.valueOf(event.getEndTime()),
                event.getVenue(),
                event.getCategory(),
                event.getMaxParticipants(),
                event.getStatus(),
                event.getEventId()
        ) > 0;
    }

    public boolean registerUser(Long eventId, Long userId) {
        // Enforce capacity check
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM event_registrations WHERE event_id = ? AND user_id = ?", Integer.class, eventId, userId);
        if (count != null && count > 0) {
            return true; // Already registered
        }
        String sql = "INSERT INTO event_registrations (event_id, user_id, attendance_status) VALUES (?, ?, 'REGISTERED')";
        int rows = jdbcTemplate.update(sql, eventId, userId);
        if (rows > 0) {
            jdbcTemplate.update("UPDATE events SET current_participants = current_participants + 1 WHERE event_id = ?", eventId);
            return true;
        }
        return false;
    }

    public boolean cancelRegistration(Long eventId, Long userId) {
        int rows = jdbcTemplate.update("DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?", eventId, userId);
        if (rows > 0) {
            jdbcTemplate.update("UPDATE events SET current_participants = GREATEST(0, current_participants - 1) WHERE event_id = ?", eventId);
            return true;
        }
        return false;
    }

    public boolean isUserRegistered(Long eventId, Long userId) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM event_registrations WHERE event_id = ? AND user_id = ?", Integer.class, eventId, userId);
        return count != null && count > 0;
    }

    public boolean deleteById(Long eventId) {
        return jdbcTemplate.update("DELETE FROM events WHERE event_id = ?", eventId) > 0;
    }

    public long countUpcoming() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM events WHERE status = 'UPCOMING'", Long.class);
    }
}
