package com.smartcampus.exception;

/**
 * Thrown when a student record cannot be found by ID or roll number.
 */
public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(String message) {
        super(message);
    }

    public StudentNotFoundException(Long studentId) {
        super("Student not found with ID: " + studentId);
    }
}
