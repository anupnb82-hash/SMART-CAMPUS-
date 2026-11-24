package com.smartcampus.exception;

public class FacultyNotFoundException extends RuntimeException {
    public FacultyNotFoundException(String message) {
        super(message);
    }
    public FacultyNotFoundException(Long facultyId) {
        super("Faculty member not found with ID: " + facultyId);
    }
}
