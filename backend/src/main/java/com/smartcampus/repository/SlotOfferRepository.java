package com.smartcampus.repository;

import com.smartcampus.model.SlotOffer;
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
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class SlotOfferRepository {

    private final JdbcTemplate jdbcTemplate;

    public SlotOfferRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<SlotOffer> slotOfferRowMapper = (rs, rowNum) -> {
        SlotOffer o = new SlotOffer();
        o.setOfferId(rs.getLong("offer_id"));
        o.setWaitId(rs.getLong("wait_id"));
        o.setBookingId(rs.getObject("booking_id") != null ? rs.getLong("booking_id") : null);
        o.setUserId(rs.getLong("user_id"));
        o.setUserName(rs.getString("username"));
        o.setResourceType(rs.getString("resource_type"));
        o.setResourceId(rs.getLong("resource_id"));
        o.setOfferDate(rs.getDate("offer_date").toLocalDate());
        o.setStartTime(rs.getTime("start_time").toLocalTime());
        o.setEndTime(rs.getTime("end_time").toLocalTime());
        o.setExpiresAt(rs.getTimestamp("expires_at").toLocalDateTime());
        o.setStatus(rs.getString("status"));
        o.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return o;
    };

    public List<SlotOffer> findAll() {
        String sql = """
            SELECT o.offer_id, o.wait_id, o.booking_id, o.user_id, u.username,
                   o.resource_type, o.resource_id, o.offer_date, o.start_time,
                   o.end_time, o.expires_at, o.status, o.created_at
            FROM slot_offers o
            JOIN users u ON o.user_id = u.user_id
            ORDER BY o.offer_id DESC
        """;
        return jdbcTemplate.query(sql, slotOfferRowMapper);
    }

    public Optional<SlotOffer> findById(Long offerId) {
        String sql = """
            SELECT o.offer_id, o.wait_id, o.booking_id, o.user_id, u.username,
                   o.resource_type, o.resource_id, o.offer_date, o.start_time,
                   o.end_time, o.expires_at, o.status, o.created_at
            FROM slot_offers o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.offer_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, slotOfferRowMapper, offerId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<SlotOffer> findByUserId(Long userId) {
        String sql = """
            SELECT o.offer_id, o.wait_id, o.booking_id, o.user_id, u.username,
                   o.resource_type, o.resource_id, o.offer_date, o.start_time,
                   o.end_time, o.expires_at, o.status, o.created_at
            FROM slot_offers o
            JOIN users u ON o.user_id = u.user_id
            WHERE o.user_id = ?
            ORDER BY o.offer_id DESC
        """;
        return jdbcTemplate.query(sql, slotOfferRowMapper, userId);
    }

    public Long save(SlotOffer offer) {
        String sql = "INSERT INTO slot_offers (wait_id, booking_id, user_id, resource_type, resource_id, offer_date, start_time, end_time, expires_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, offer.getWaitId());
            if (offer.getBookingId() != null) ps.setLong(2, offer.getBookingId());
            else ps.setNull(2, java.sql.Types.BIGINT);
            ps.setLong(3, offer.getUserId());
            ps.setString(4, offer.getResourceType());
            ps.setLong(5, offer.getResourceId());
            ps.setDate(6, Date.valueOf(offer.getOfferDate()));
            ps.setTime(7, Time.valueOf(offer.getStartTime()));
            ps.setTime(8, Time.valueOf(offer.getEndTime()));
            ps.setTimestamp(9, Timestamp.valueOf(offer.getExpiresAt()));
            ps.setString(10, offer.getStatus());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean updateStatus(Long offerId, String status, Long bookingId) {
        String sql = "UPDATE slot_offers SET status = ?, booking_id = ? WHERE offer_id = ?";
        return jdbcTemplate.update(sql, status, bookingId, offerId) > 0;
    }

    public long countRecovered() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM slot_offers WHERE status = 'ACCEPTED'", Long.class);
    }
}
