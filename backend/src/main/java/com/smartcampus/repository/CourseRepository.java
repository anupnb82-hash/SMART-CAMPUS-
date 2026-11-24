package com.smartcampus.repository;

import com.smartcampus.model.Course;
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
public class CourseRepository {

    private final JdbcTemplate jdbcTemplate;

    public CourseRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Course> courseRowMapper = (rs, rowNum) -> {
        Course c = new Course();
        c.setCourseId(rs.getLong("course_id"));
        c.setCourseCode(rs.getString("course_code"));
        c.setCourseName(rs.getString("course_name"));
        c.setDepartmentId(rs.getLong("department_id"));
        c.setDepartmentName(rs.getString("department_name"));
        c.setFacultyId(rs.getObject("faculty_id") != null ? rs.getLong("faculty_id") : null);
        c.setFacultyName(rs.getString("faculty_name"));
        c.setCredits(rs.getInt("credits"));
        c.setSemester(rs.getInt("semester"));
        c.setDescription(rs.getString("description"));
        c.setSchedule(rs.getString("schedule"));
        c.setMaxEnrollment(rs.getInt("max_enrollment"));
        c.setEnrolledCount(rs.getInt("enrolled_count"));
        c.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return c;
    };

    public List<Course> findAll() {
        String sql = """
            SELECT c.course_id, c.course_code, c.course_name, c.department_id, d.department_name,
                   c.faculty_id, f.full_name AS faculty_name, c.credits, c.semester, c.description,
                   c.schedule, c.max_enrollment,
                   (SELECT COUNT(*) FROM student_courses sc WHERE sc.course_id = c.course_id) AS enrolled_count,
                   c.created_at
            FROM courses c
            JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
            ORDER BY c.course_code ASC
        """;
        return jdbcTemplate.query(sql, courseRowMapper);
    }

    public Optional<Course> findById(Long courseId) {
        String sql = """
            SELECT c.course_id, c.course_code, c.course_name, c.department_id, d.department_name,
                   c.faculty_id, f.full_name AS faculty_name, c.credits, c.semester, c.description,
                   c.schedule, c.max_enrollment,
                   (SELECT COUNT(*) FROM student_courses sc WHERE sc.course_id = c.course_id) AS enrolled_count,
                   c.created_at
            FROM courses c
            JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
            WHERE c.course_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, courseRowMapper, courseId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public List<Course> findByFacultyId(Long facultyId) {
        String sql = """
            SELECT c.course_id, c.course_code, c.course_name, c.department_id, d.department_name,
                   c.faculty_id, f.full_name AS faculty_name, c.credits, c.semester, c.description,
                   c.schedule, c.max_enrollment,
                   (SELECT COUNT(*) FROM student_courses sc WHERE sc.course_id = c.course_id) AS enrolled_count,
                   c.created_at
            FROM courses c
            JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
            WHERE c.faculty_id = ?
        """;
        return jdbcTemplate.query(sql, courseRowMapper, facultyId);
    }

    public List<Course> findEnrolledCoursesByStudentId(Long studentId) {
        String sql = """
            SELECT c.course_id, c.course_code, c.course_name, c.department_id, d.department_name,
                   c.faculty_id, f.full_name AS faculty_name, c.credits, c.semester, c.description,
                   c.schedule, c.max_enrollment,
                   (SELECT COUNT(*) FROM student_courses sc2 WHERE sc2.course_id = c.course_id) AS enrolled_count,
                   c.created_at
            FROM courses c
            JOIN departments d ON c.department_id = d.department_id
            LEFT JOIN faculty f ON c.faculty_id = f.faculty_id
            JOIN student_courses sc ON c.course_id = sc.course_id
            WHERE sc.student_id = ?
        """;
        return jdbcTemplate.query(sql, courseRowMapper, studentId);
    }

    public Long save(Course course) {
        String sql = "INSERT INTO courses (course_code, course_name, department_id, faculty_id, credits, semester, description, schedule, max_enrollment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, course.getCourseCode());
            ps.setString(2, course.getCourseName());
            ps.setLong(3, course.getDepartmentId());
            if (course.getFacultyId() != null) {
                ps.setLong(4, course.getFacultyId());
            } else {
                ps.setNull(4, java.sql.Types.BIGINT);
            }
            ps.setInt(5, course.getCredits());
            ps.setInt(6, course.getSemester());
            ps.setString(7, course.getDescription());
            ps.setString(8, course.getSchedule());
            ps.setInt(9, course.getMaxEnrollment());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean update(Course course) {
        String sql = "UPDATE courses SET course_code = ?, course_name = ?, department_id = ?, faculty_id = ?, credits = ?, semester = ?, description = ?, schedule = ?, max_enrollment = ? WHERE course_id = ?";
        return jdbcTemplate.update(sql,
                course.getCourseCode(),
                course.getCourseName(),
                course.getDepartmentId(),
                course.getFacultyId(),
                course.getCredits(),
                course.getSemester(),
                course.getDescription(),
                course.getSchedule(),
                course.getMaxEnrollment(),
                course.getCourseId()
        ) > 0;
    }

    public boolean deleteById(Long courseId) {
        return jdbcTemplate.update("DELETE FROM courses WHERE course_id = ?", courseId) > 0;
    }

    public long count() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM courses", Long.class);
    }
}
