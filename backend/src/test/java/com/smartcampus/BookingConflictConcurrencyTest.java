package com.smartcampus;

import com.smartcampus.model.Booking;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Resource Booking Overlap & Conflict Detection Tests")
public class BookingConflictConcurrencyTest {

    @Test
    @DisplayName("Should detect direct time interval overlap on the same date")
    public void testDirectTimeOverlap() {
        Booking existing = new Booking(
                1L, 2L, "CLASSROOM", 1L,
                LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(12, 0),
                "Database Systems Lecture"
        );

        // Requested overlap: 11:00 to 13:00 (overlaps during 11:00-12:00)
        boolean overlaps = existing.overlapsWith(LocalDate.now(), LocalTime.of(11, 0), LocalTime.of(13, 0));
        assertTrue(overlaps, "Should detect partial interval overlap");
    }

    @Test
    @DisplayName("Should permit contiguous non-overlapping bookings (back-to-back)")
    public void testContiguousNonOverlapping() {
        Booking existing = new Booking(
                1L, 2L, "CLASSROOM", 1L,
                LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(12, 0),
                "Database Systems Lecture"
        );

        // Back to back: 12:00 to 14:00 (starts exactly when previous ends)
        boolean overlaps = existing.overlapsWith(LocalDate.now(), LocalTime.of(12, 0), LocalTime.of(14, 0));
        assertFalse(overlaps, "Back-to-back reservation should not be flagged as an overlap");
    }

    @Test
    @DisplayName("Cancelled reservations should not block newly requested time slots")
    public void testCancelledBookingDoesNotConflict() {
        Booking cancelled = new Booking(
                2L, 4L, "CLASSROOM", 1L,
                LocalDate.now(), LocalTime.of(14, 0), LocalTime.of(16, 0),
                "Cancelled Study Group"
        );
        cancelled.setStatus("CANCELLED");

        boolean overlaps = cancelled.overlapsWith(LocalDate.now(), LocalTime.of(14, 30), LocalTime.of(15, 30));
        assertFalse(overlaps, "Cancelled bookings must never trigger overlap conflicts");
    }
}
