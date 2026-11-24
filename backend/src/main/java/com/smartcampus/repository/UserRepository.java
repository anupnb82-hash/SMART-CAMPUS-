package com.smartcampus.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Map;
import java.util.Optional;

/**
 * User Data Access Repository using Spring JdbcTemplate.
 * Strictly JDBC / Parameterized queries for SQL injection immunity.
 */
@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Map<String, Object>> userRowMapper = (rs, rowNum) -> {
        return Map.of(
            "userId", rs.getLong("user_id"),
            "username", rs.getString("username"),
            "email", rs.getString("email"),
            "passwordHash", rs.getString("password_hash"),
            "role", rs.getString("role"),
            "accountStatus", rs.getString("account_status")
        );
    };

    public Optional<Map<String, Object>> findByEmail(String email) {
        String sql = "SELECT user_id, username, email, password_hash, role, account_status FROM users WHERE email = ?";
        try {
            Map<String, Object> user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Map<String, Object>> findById(Long userId) {
        String sql = "SELECT user_id, username, email, password_hash, role, account_status FROM users WHERE user_id = ?";
        try {
            Map<String, Object> user = jdbcTemplate.queryForObject(sql, userRowMapper, userId);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long createUser(String username, String email, String passwordHash, String role) {
        String sql = "INSERT INTO users (username, email, password_hash, role, account_status) VALUES (?, ?, ?, ?, 'ACTIVE')";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, username);
            ps.setString(2, email);
            ps.setString(3, passwordHash);
            ps.setString(4, role);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean updatePassword(Long userId, String newPasswordHash) {
        String sql = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        return jdbcTemplate.update(sql, newPasswordHash, userId) > 0;
    }

    public boolean updateStatus(Long userId, String status) {
        String sql = "UPDATE users SET account_status = ? WHERE user_id = ?";
        return jdbcTemplate.update(sql, status, userId) > 0;
    }

    public long count() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
    }
}
