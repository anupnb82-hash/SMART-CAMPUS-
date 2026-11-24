package com.smartcampus.model;

import java.time.LocalDateTime;

/**
 * Course entity representing academic courses, scheduling, and faculty assignment.
 */
public class Course {
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long departmentId;
    private String departmentName;
    private Long facultyId;
    private String facultyName;
    private int credits;
    private int semester;
    private String description;
    private String schedule;
    private int maxEnrollment;
    private int enrolledCount;
    private LocalDateTime createdAt;

    public Course() {
        this.credits = 3;
        this.maxEnrollment = 60;
        this.createdAt = LocalDateTime.now();
    }

    public Course(Long courseId, String courseCode, String courseName, Long departmentId, 
                  Long facultyId, int credits, int semester, String schedule) {
        this();
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.departmentId = departmentId;
        this.facultyId = facultyId;
        this.credits = credits;
        this.semester = semester;
        this.schedule = schedule;
    }

    // Getters and Setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getFacultyId() { return facultyId; }
    public void setFacultyId(Long facultyId) { this.facultyId = facultyId; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }

    public int getMaxEnrollment() { return maxEnrollment; }
    public void setMaxEnrollment(int maxEnrollment) { this.maxEnrollment = maxEnrollment; }

    public int getEnrolledCount() { return enrolledCount; }
    public void setEnrolledCount(int enrolledCount) { this.enrolledCount = enrolledCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
