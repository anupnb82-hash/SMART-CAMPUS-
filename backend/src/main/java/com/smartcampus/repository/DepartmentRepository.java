package com.smartcampus.repository;

import com.smartcampus.model.Department;
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
public class DepartmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public DepartmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Department> departmentRowMapper = (rs, rowNum) -> {
        Department d = new Department();
        d.setDepartmentId(rs.getLong("department_id"));
        d.setDepartmentCode(rs.getString("department_code"));
        d.setDepartmentName(rs.getString("department_name"));
        d.setBuilding(rs.getString("building"));
        d.setHeadOfDepartment(rs.getString("head_of_department"));
        d.setContactEmail(rs.getString("contact_email"));
        d.setContactPhone(rs.getString("contact_phone"));
        d.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        d.setStudentCount(rs.getInt("student_count"));
        d.setFacultyCount(rs.getInt("faculty_count"));
        d.setCourseCount(rs.getInt("course_count"));
        return d;
    };

    public List<Department> findAll() {
        String sql = """
            SELECT d.department_id, d.department_code, d.department_name, d.building,
                   d.head_of_department, d.contact_email, d.contact_phone, d.created_at,
                   (SELECT COUNT(*) FROM students s WHERE s.department_id = d.department_id) AS student_count,
                   (SELECT COUNT(*) FROM faculty f WHERE f.department_id = d.department_id) AS faculty_count,
                   (SELECT COUNT(*) FROM courses c WHERE c.department_id = d.department_id) AS course_count
            FROM departments d
            ORDER BY d.department_name ASC
        """;
        return jdbcTemplate.query(sql, departmentRowMapper);
    }

    public Optional<Department> findById(Long departmentId) {
        String sql = """
            SELECT d.department_id, d.department_code, d.department_name, d.building,
                   d.head_of_department, d.contact_email, d.contact_phone, d.created_at,
                   (SELECT COUNT(*) FROM students s WHERE s.department_id = d.department_id) AS student_count,
                   (SELECT COUNT(*) FROM faculty f WHERE f.department_id = d.department_id) AS faculty_count,
                   (SELECT COUNT(*) FROM courses c WHERE c.department_id = d.department_id) AS course_count
            FROM departments d
            WHERE d.department_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, departmentRowMapper, departmentId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long save(Department dept) {
        String sql = "INSERT INTO departments (department_code, department_name, building, head_of_department, contact_email, contact_phone) VALUES (?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, dept.getDepartmentCode());
            ps.setString(2, dept.getDepartmentName());
            ps.setString(3, dept.getBuilding());
            ps.setString(4, dept.getHeadOfDepartment());
            ps.setString(5, dept.getContactEmail());
            ps.setString(6, dept.getContactPhone());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean update(Department dept) {
        String sql = "UPDATE departments SET department_code = ?, department_name = ?, building = ?, head_of_department = ?, contact_email = ?, contact_phone = ? WHERE department_id = ?";
        return jdbcTemplate.update(sql,
                dept.getDepartmentCode(),
                dept.getDepartmentName(),
                dept.getBuilding(),
                dept.getHeadOfDepartment(),
                dept.getContactEmail(),
                dept.getContactPhone(),
                dept.getDepartmentId()
        ) > 0;
    }

    public boolean hasDependentRecords(Long departmentId) {
        Integer students = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM students WHERE department_id = ?", Integer.class, departmentId);
        Integer faculty = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM faculty WHERE department_id = ?", Integer.class, departmentId);
        Integer courses = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM courses WHERE department_id = ?", Integer.class, departmentId);
        return (students != null && students > 0) || (faculty != null && faculty > 0) || (courses != null && courses > 0);
    }

    public boolean deleteById(Long departmentId) {
        if (hasDependentRecords(departmentId)) {
            throw new IllegalStateException("Cannot delete department with active enrolled students, faculty, or registered courses.");
        }
        return jdbcTemplate.update("DELETE FROM departments WHERE department_id = ?", departmentId) > 0;
    }

    public long count() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM departments", Long.class);
    }
}
