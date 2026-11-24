package com.smartcampus.repository;

import com.smartcampus.model.Faculty;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class FacultyRepository {

    private final JdbcTemplate jdbcTemplate;

    public FacultyRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Faculty> facultyRowMapper = (rs, rowNum) -> {
        Faculty f = new Faculty();
        f.setId(rs.getLong("faculty_id"));
        f.setUserId(rs.getLong("user_id"));
        f.setFullName(rs.getString("full_name"));
        f.setEmail(rs.getString("email"));
        f.setPhone(rs.getString("phone"));
        f.setEmployeeCode(rs.getString("employee_code"));
        f.setDepartmentId(rs.getLong("department_id"));
        f.setDepartmentName(rs.getString("department_name"));
        f.setDesignation(rs.getString("designation"));
        f.setOfficeRoom(rs.getString("office_room"));
        f.setSpecialization(rs.getString("specialization"));
        f.setAccountStatus(rs.getString("account_status"));
        f.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return f;
    };

    public List<Faculty> findAll() {
        String sql = """
            SELECT f.faculty_id, f.user_id, f.full_name, u.email, f.phone, f.employee_code,
                   f.department_id, d.department_name, f.designation, f.office_room,
                   f.specialization, u.account_status, f.created_at
            FROM faculty f
            JOIN users u ON f.user_id = u.user_id
            JOIN departments d ON f.department_id = d.department_id
            ORDER BY f.faculty_id DESC
        """;
        return jdbcTemplate.query(sql, facultyRowMapper);
    }

    public Optional<Faculty> findById(Long facultyId) {
        String sql = """
            SELECT f.faculty_id, f.user_id, f.full_name, u.email, f.phone, f.employee_code,
                   f.department_id, d.department_name, f.designation, f.office_room,
                   f.specialization, u.account_status, f.created_at
            FROM faculty f
            JOIN users u ON f.user_id = u.user_id
            JOIN departments d ON f.department_id = d.department_id
            WHERE f.faculty_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, facultyRowMapper, facultyId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Faculty> findByUserId(Long userId) {
        String sql = """
            SELECT f.faculty_id, f.user_id, f.full_name, u.email, f.phone, f.employee_code,
                   f.department_id, d.department_name, f.designation, f.office_room,
                   f.specialization, u.account_status, f.created_at
            FROM faculty f
            JOIN users u ON f.user_id = u.user_id
            JOIN departments d ON f.department_id = d.department_id
            WHERE f.user_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, facultyRowMapper, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long save(Faculty faculty) {
        String sql = "INSERT INTO faculty (user_id, full_name, employee_code, department_id, designation, phone, office_room, specialization) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, faculty.getUserId());
            ps.setString(2, faculty.getFullName());
            ps.setString(3, faculty.getEmployeeCode());
            ps.setLong(4, faculty.getDepartmentId());
            ps.setString(5, faculty.getDesignation());
            ps.setString(6, faculty.getPhone());
            ps.setString(7, faculty.getOfficeRoom());
            ps.setString(8, faculty.getSpecialization());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean update(Faculty faculty) {
        String sql = "UPDATE faculty SET full_name = ?, employee_code = ?, department_id = ?, designation = ?, phone = ?, office_room = ?, specialization = ? WHERE faculty_id = ?";
        return jdbcTemplate.update(sql,
                faculty.getFullName(),
                faculty.getEmployeeCode(),
                faculty.getDepartmentId(),
                faculty.getDesignation(),
                faculty.getPhone(),
                faculty.getOfficeRoom(),
                faculty.getSpecialization(),
                faculty.getId()
        ) > 0;
    }

    public boolean deleteById(Long facultyId) {
        return jdbcTemplate.update("DELETE FROM faculty WHERE faculty_id = ?", facultyId) > 0;
    }

    public long count() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM faculty", Long.class);
    }
}
