package com.smartcampus.exception;

/**
 * Thrown when a resource booking overlaps with an existing reservation.
 * Part of Concurrency and Conflict Prevention mechanisms.
 */
public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}
