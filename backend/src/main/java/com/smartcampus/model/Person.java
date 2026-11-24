package com.smartcampus.model;

import java.time.LocalDateTime;

/**
 * Abstract Base Class: Person
 * 
 * Demonstrates:
 * - Abstraction: Abstract base representation of university members
 * - Encapsulation: Private fields with validated getters and setters
 * - Polymorphism: Abstract method getRoleDescription() implemented by subclasses
 */
public abstract class Person {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;
    private String accountStatus; // ACTIVE, INACTIVE, SUSPENDED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default Constructor
    public Person() {
        this.accountStatus = "ACTIVE";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Parameterized Constructor
    public Person(Long id, Long userId, String fullName, String email, String phone, Long departmentId) {
        this();
        this.id = id;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.departmentId = departmentId;
    }

    // Abstract method demonstrating Polymorphism
    public abstract String getRoleDescription();

    // Polymorphic display summary method
    public String getDisplaySummary() {
        return String.format("[%s] %s (%s)", getRoleDescription(), fullName, email);
    }

    // Getters and Setters with Encapsulation
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { 
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name cannot be blank");
        }
        this.fullName = fullName.trim(); 
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { 
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid university email format");
        }
        this.email = email.trim(); 
    }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
