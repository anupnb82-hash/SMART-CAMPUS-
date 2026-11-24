package com.smartcampus.model;

import java.time.LocalDateTime;

/**
 * Department entity representing academic faculties and administrative divisions.
 */
public class Department {
    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private String building;
    private String headOfDepartment;
    private String contactEmail;
    private String contactPhone;
    private int studentCount;
    private int facultyCount;
    private int courseCount;
    private LocalDateTime createdAt;

    public Department() {
        this.createdAt = LocalDateTime.now();
    }

    public Department(Long departmentId, String departmentCode, String departmentName, 
                      String building, String headOfDepartment) {
        this();
        this.departmentId = departmentId;
        this.departmentCode = departmentCode;
        this.departmentName = departmentName;
        this.building = building;
        this.headOfDepartment = headOfDepartment;
    }

    // Getters and Setters
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getHeadOfDepartment() { return headOfDepartment; }
    public void setHeadOfDepartment(String headOfDepartment) { this.headOfDepartment = headOfDepartment; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public int getStudentCount() { return studentCount; }
    public void setStudentCount(int studentCount) { this.studentCount = studentCount; }

    public int getFacultyCount() { return facultyCount; }
    public void setFacultyCount(int facultyCount) { this.facultyCount = facultyCount; }

    public int getCourseCount() { return courseCount; }
    public void setCourseCount(int courseCount) { this.courseCount = courseCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
