package com.smartcampus.model;

import java.time.LocalDateTime;

/**
 * Course Assignment entity created by faculty.
 */
public class Assignment {
    private Long assignmentId;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long facultyId;
    private String facultyName;
    private String title;
    private String instructions;
    private LocalDateTime deadline;
    private int maxScore;
    private String fileAttachmentUrl;
    private int totalSubmissions;
    private LocalDateTime createdAt;

    public Assignment() {
        this.maxScore = 100;
        this.createdAt = LocalDateTime.now();
    }

    public boolean isPastDeadline() {
        return LocalDateTime.now().isAfter(deadline);
    }

    // Getters and Setters
    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { this.maxScore = maxScore; }

    public String getFileAttachmentUrl() { return fileAttachmentUrl; }
    public void setFileAttachmentUrl(String fileAttachmentUrl) { this.fileAttachmentUrl = fileAttachmentUrl; }

    public int getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(int totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
