package com.smartcampus.repository;

import com.smartcampus.model.Student;
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

/**
 * Student Repository implementing CRUD operations via Spring JdbcTemplate.
 */
@Repository
public class StudentRepository {

    private final JdbcTemplate jdbcTemplate;

    public StudentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Student> studentRowMapper = (rs, rowNum) -> {
        Student s = new Student();
        s.setId(rs.getLong("student_id"));
        s.setUserId(rs.getLong("user_id"));
        s.setFullName(rs.getString("full_name"));
        s.setEmail(rs.getString("email"));
        s.setPhone(rs.getString("phone"));
        s.setRollNumber(rs.getString("roll_number"));
        s.setDepartmentId(rs.getLong("department_id"));
        s.setDepartmentName(rs.getString("department_name"));
        s.setAcademicYear(rs.getInt("academic_year"));
        s.setSemester(rs.getInt("semester"));
        s.setCgpa(rs.getBigDecimal("cgpa"));
        s.setAccountStatus(rs.getString("account_status"));
        s.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return s;
    };

    public List<Student> findAll() {
        String sql = """
            SELECT s.student_id, s.user_id, s.full_name, u.email, s.phone, s.roll_number,
                   s.department_id, d.department_name, s.academic_year, s.semester, s.cgpa,
                   u.account_status, s.created_at
            FROM students s
            JOIN users u ON s.user_id = u.user_id
            JOIN departments d ON s.department_id = d.department_id
            ORDER BY s.student_id DESC
        """;
        return jdbcTemplate.query(sql, studentRowMapper);
    }

    public Optional<Student> findById(Long studentId) {
        String sql = """
            SELECT s.student_id, s.user_id, s.full_name, u.email, s.phone, s.roll_number,
                   s.department_id, d.department_name, s.academic_year, s.semester, s.cgpa,
                   u.account_status, s.created_at
            FROM students s
            JOIN users u ON s.user_id = u.user_id
            JOIN departments d ON s.department_id = d.department_id
            WHERE s.student_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, studentRowMapper, studentId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<Student> findByUserId(Long userId) {
        String sql = """
            SELECT s.student_id, s.user_id, s.full_name, u.email, s.phone, s.roll_number,
                   s.department_id, d.department_name, s.academic_year, s.semester, s.cgpa,
                   u.account_status, s.created_at
            FROM students s
            JOIN users u ON s.user_id = u.user_id
            JOIN departments d ON s.department_id = d.department_id
            WHERE s.user_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, studentRowMapper, userId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long save(Student student) {
        String sql = "INSERT INTO students (user_id, full_name, roll_number, department_id, academic_year, semester, phone, cgpa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, student.getUserId());
            ps.setString(2, student.getFullName());
            ps.setString(3, student.getRollNumber());
            ps.setLong(4, student.getDepartmentId());
            ps.setInt(5, student.getAcademicYear());
            ps.setInt(6, student.getSemester());
            ps.setString(7, student.getPhone());
            ps.setBigDecimal(8, student.getCgpa());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean update(Student student) {
        String sql = "UPDATE students SET full_name = ?, roll_number = ?, department_id = ?, academic_year = ?, semester = ?, phone = ?, cgpa = ? WHERE student_id = ?";
        return jdbcTemplate.update(sql,
                student.getFullName(),
                student.getRollNumber(),
                student.getDepartmentId(),
                student.getAcademicYear(),
                student.getSemester(),
                student.getPhone(),
                student.getCgpa(),
                student.getId()
        ) > 0;
    }

    public boolean deleteById(Long studentId) {
        String sql = "DELETE FROM students WHERE student_id = ?";
        return jdbcTemplate.update(sql, studentId) > 0;
    }

    public long count() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM students", Long.class);
    }
}
