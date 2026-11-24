package com.smartcampus.interfaces;

/**
 * Interface for campus entities that require administrative status tracking,
 * maintenance scheduling, and lifecycle management.
 */
public interface Manageable {
    String getIdentifier();
    String getStatus();
    void setStatus(String status);
    boolean isActive();
}
