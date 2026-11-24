package com.smartcampus.repository;

import com.smartcampus.model.Assignment;
import com.smartcampus.model.AssignmentSubmission;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class AssignmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public AssignmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Assignment> assignmentRowMapper = (rs, rowNum) -> {
        Assignment a = new Assignment();
        a.setAssignmentId(rs.getLong("assignment_id"));
        a.setCourseId(rs.getLong("course_id"));
        a.setCourseCode(rs.getString("course_code"));
        a.setCourseName(rs.getString("course_name"));
        a.setFacultyId(rs.getLong("faculty_id"));
        a.setFacultyName(rs.getString("faculty_name"));
        a.setTitle(rs.getString("title"));
        a.setInstructions(rs.getString("instructions"));
        a.setDeadline(rs.getTimestamp("deadline").toLocalDateTime());
        a.setMaxScore(rs.getInt("max_score"));
        a.setFileAttachmentUrl(rs.getString("file_attachment_url"));
        a.setTotalSubmissions(rs.getInt("total_submissions"));
        a.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        return a;
    };

    private final RowMapper<AssignmentSubmission> submissionRowMapper = (rs, rowNum) -> {
        AssignmentSubmission sub = new AssignmentSubmission();
        sub.setSubmissionId(rs.getLong("submission_id"));
        sub.setAssignmentId(rs.getLong("assignment_id"));
        sub.setAssignmentTitle(rs.getString("title"));
        sub.setStudentId(rs.getLong("student_id"));
        sub.setStudentName(rs.getString("student_name"));
        sub.setRollNumber(rs.getString("roll_number"));
        sub.setSubmissionText(rs.getString("submission_text"));
        sub.setFileName(rs.getString("file_name"));
        sub.setFilePath(rs.getString("file_path"));
        sub.setSubmittedAt(rs.getTimestamp("submitted_at").toLocalDateTime());
        sub.setScore(rs.getObject("score") != null ? rs.getInt("score") : null);
        sub.setFeedback(rs.getString("feedback"));
        sub.setEvaluationStatus(rs.getString("evaluation_status"));
        return sub;
    };

    public List<Assignment> findAll() {
        String sql = """
            SELECT a.assignment_id, a.course_id, c.course_code, c.course_name,
                   a.faculty_id, f.full_name AS faculty_name, a.title, a.instructions,
                   a.deadline, a.max_score, a.file_attachment_url,
                   (SELECT COUNT(*) FROM assignment_submissions s WHERE s.assignment_id = a.assignment_id) AS total_submissions,
                   a.created_at
            FROM assignments a
            JOIN courses c ON a.course_id = c.course_id
            JOIN faculty f ON a.faculty_id = f.faculty_id
            ORDER BY a.deadline ASC
        """;
        return jdbcTemplate.query(sql, assignmentRowMapper);
    }

    public List<Assignment> findByCourseId(Long courseId) {
        String sql = """
            SELECT a.assignment_id, a.course_id, c.course_code, c.course_name,
                   a.faculty_id, f.full_name AS faculty_name, a.title, a.instructions,
                   a.deadline, a.max_score, a.file_attachment_url,
                   (SELECT COUNT(*) FROM assignment_submissions s WHERE s.assignment_id = a.assignment_id) AS total_submissions,
                   a.created_at
            FROM assignments a
            JOIN courses c ON a.course_id = c.course_id
            JOIN faculty f ON a.faculty_id = f.faculty_id
            WHERE a.course_id = ?
            ORDER BY a.deadline ASC
        """;
        return jdbcTemplate.query(sql, assignmentRowMapper, courseId);
    }

    public Optional<Assignment> findById(Long assignmentId) {
        String sql = """
            SELECT a.assignment_id, a.course_id, c.course_code, c.course_name,
                   a.faculty_id, f.full_name AS faculty_name, a.title, a.instructions,
                   a.deadline, a.max_score, a.file_attachment_url,
                   (SELECT COUNT(*) FROM assignment_submissions s WHERE s.assignment_id = a.assignment_id) AS total_submissions,
                   a.created_at
            FROM assignments a
            JOIN courses c ON a.course_id = c.course_id
            JOIN faculty f ON a.faculty_id = f.faculty_id
            WHERE a.assignment_id = ?
        """;
        try {
            return Optional.ofNullable(jdbcTemplate.queryForObject(sql, assignmentRowMapper, assignmentId));
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long save(Assignment a) {
        String sql = "INSERT INTO assignments (course_id, faculty_id, title, instructions, deadline, max_score, file_attachment_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, a.getCourseId());
            ps.setLong(2, a.getFacultyId());
            ps.setString(3, a.getTitle());
            ps.setString(4, a.getInstructions());
            ps.setTimestamp(5, Timestamp.valueOf(a.getDeadline()));
            ps.setInt(6, a.getMaxScore());
            ps.setString(7, a.getFileAttachmentUrl());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public List<AssignmentSubmission> findSubmissionsByAssignmentId(Long assignmentId) {
        String sql = """
            SELECT s.submission_id, s.assignment_id, a.title, s.student_id,
                   st.full_name AS student_name, st.roll_number, s.submission_text,
                   s.file_name, s.file_path, s.submitted_at, s.score, s.feedback,
                   s.evaluation_status
            FROM assignment_submissions s
            JOIN assignments a ON s.assignment_id = a.assignment_id
            JOIN students st ON s.student_id = st.student_id
            WHERE s.assignment_id = ?
            ORDER BY s.submitted_at ASC
        """;
        return jdbcTemplate.query(sql, submissionRowMapper, assignmentId);
    }

    public boolean submitAssignment(AssignmentSubmission sub) {
        String sql = """
            INSERT INTO assignment_submissions (assignment_id, student_id, submission_text, file_name, file_path, evaluation_status)
            VALUES (?, ?, ?, ?, ?, 'PENDING')
            ON DUPLICATE KEY UPDATE submission_text = VALUES(submission_text), file_name = VALUES(file_name), file_path = VALUES(file_path), submitted_at = CURRENT_TIMESTAMP
        """;
        return jdbcTemplate.update(sql,
                sub.getAssignmentId(),
                sub.getStudentId(),
                sub.getSubmissionText(),
                sub.getFileName(),
                sub.getFilePath()
        ) > 0;
    }

    public boolean evaluateSubmission(Long submissionId, int score, String feedback) {
        String sql = "UPDATE assignment_submissions SET score = ?, feedback = ?, evaluation_status = 'EVALUATED' WHERE submission_id = ?";
        return jdbcTemplate.update(sql, score, feedback, submissionId) > 0;
    }

    public boolean deleteById(Long assignmentId) {
        return jdbcTemplate.update("DELETE FROM assignments WHERE assignment_id = ?", assignmentId) > 0;
    }
}
