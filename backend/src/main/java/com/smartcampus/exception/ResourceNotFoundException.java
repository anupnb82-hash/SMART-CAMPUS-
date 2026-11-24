package com.smartcampus.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    public ResourceNotFoundException(String resourceType, Long resourceId) {
        super(String.format("Resource of type %s not found with ID: %d", resourceType, resourceId));
    }
}
