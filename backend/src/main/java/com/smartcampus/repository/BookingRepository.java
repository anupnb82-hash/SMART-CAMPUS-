package com.smartcampus.repository;

import com.smartcampus.model.Booking;
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
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepository {

    private final JdbcTemplate jdbcTemplate;

    public BookingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Booking> bookingRowMapper = (rs, rowNum) -> {
        Booking b = new Booking();
        b.setBookingId(rs.getLong("booking_id"));
        b.setUserId(rs.getLong("user_id"));
        b.setUserName(rs.getString("username"));
        b.setUserRole(rs.getString("role"));
        b.setResourceType(rs.getString("resource_type"));
        b.setResourceId(rs.getLong("resource_id"));
        b.setBookingDate(rs.getDate("booking_date").toLocalDate());
        b.setStartTime(rs.getTime("start_time").toLocalTime());
        b.setEndTime(rs.getTime("end_time").toLocalTime());
        b.setPurpose(rs.getString("purpose"));
        b.setStatus(rs.getString("status"));
        b.setCheckInStatus(rs.getString("check_in_status"));
        b.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return b;
    };

    public List<Booking> findAll() {
        String sql = """
            SELECT b.booking_id, b.user_id, u.username, u.role, b.resource_type,
                   b.resource_id, b.booking_date, b.start_time, b.end_time,
                   b.purpose, b.status, b.check_in_status, b.created_at
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            ORDER BY b.booking_date DESC, b.start_time DESC
        """;
        return jdbcTemplate.query(sql, bookingRowMapper);
    }

    public Optional<Booking> findById(Long bookingId) {
        String sql = """
            SELECT b.booking_id, b.user_id, u.username, u.role, b.resource_type,
                   b.resource_id, b.booking_date, b.start_time, b.end_time,
                   b.purpose, b.status, b.check_in_status, b.created_at
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            WHERE b.booking_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, bookingRowMapper, bookingId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Booking> findByUserId(Long userId) {
        String sql = """
            SELECT b.booking_id, b.user_id, u.username, u.role, b.resource_type,
                   b.resource_id, b.booking_date, b.start_time, b.end_time,
                   b.purpose, b.status, b.check_in_status, b.created_at
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC, b.start_time DESC
        """;
        return jdbcTemplate.query(sql, bookingRowMapper, userId);
    }

    /**
     * Finds overlapping confirmed reservations using database-level range query.
     * Overlap occurs when start_time < requestedEndTime AND end_time > requestedStartTime.
     */
    public List<Booking> findOverlappingBookings(String resourceType, Long resourceId, LocalDate date, LocalTime start, LocalTime end) {
        String sql = """
            SELECT b.booking_id, b.user_id, u.username, u.role, b.resource_type,
                   b.resource_id, b.booking_date, b.start_time, b.end_time,
                   b.purpose, b.status, b.check_in_status, b.created_at
            FROM bookings b
            JOIN users u ON b.user_id = u.user_id
            WHERE b.resource_type = ?
              AND b.resource_id = ?
              AND b.booking_date = ?
              AND b.status IN ('CONFIRMED', 'PENDING')
              AND b.start_time < ?
              AND b.end_time > ?
        """;
        return jdbcTemplate.query(sql, bookingRowMapper, 
                resourceType, resourceId, Date.valueOf(date), Time.valueOf(end), Time.valueOf(start));
    }

    public Long save(Booking booking) {
        String sql = "INSERT INTO bookings (user_id, resource_type, resource_id, booking_date, start_time, end_time, purpose, status, check_in_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, booking.getUserId());
            ps.setString(2, booking.getResourceType());
            ps.setLong(3, booking.getResourceId());
            ps.setDate(4, Date.valueOf(booking.getBookingDate()));
            ps.setTime(5, Time.valueOf(booking.getStartTime()));
            ps.setTime(6, Time.valueOf(booking.getEndTime()));
            ps.setString(7, booking.getPurpose());
            ps.setString(8, booking.getStatus());
            ps.setString(9, booking.getCheckInStatus());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean updateStatus(Long bookingId, String status) {
        String sql = "UPDATE bookings SET status = ? WHERE booking_id = ?";
        return jdbcTemplate.update(sql, status, bookingId) > 0;
    }

    public boolean updateCheckInStatus(Long bookingId, String checkInStatus) {
        String sql = "UPDATE bookings SET check_in_status = ? WHERE booking_id = ?";
        return jdbcTemplate.update(sql, checkInStatus, bookingId) > 0;
    }

    public boolean deleteById(Long bookingId) {
        return jdbcTemplate.update("DELETE FROM bookings WHERE booking_id = ?", bookingId) > 0;
    }

    public long count() { return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM bookings", Long.class); }
    public long countPending() { return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM bookings WHERE status = 'PENDING'", Long.class); }
    public long countConfirmed() { return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM bookings WHERE status = 'CONFIRMED'", Long.class); }
    public long countNoShows() { return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM bookings WHERE status = 'NO_SHOW'", Long.class); }
}
