package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.exception.InvalidBookingException;
import com.smartcampus.model.Booking;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.util.ReportGenerator;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CampusResourceRescueEngineService rescueEngineService;
    private final NotificationService notificationService;
    private final ActivityLogRepository activityLogRepository;

    // Use synchronized resource monitor object to demonstrate synchronization
    private static final Object BOOKING_LOCK = new Object();

    public BookingService(BookingRepository bookingRepository,
                          @Lazy CampusResourceRescueEngineService rescueEngineService,
                          NotificationService notificationService,
                          ActivityLogRepository activityLogRepository) {
        this.bookingRepository = bookingRepository;
        this.rescueEngineService = rescueEngineService;
        this.notificationService = notificationService;
        this.activityLogRepository = activityLogRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + id));
    }

    /**
     * Creates a new booking with strict validation and concurrency control.
     * Demonstrates:
     * - Database Transaction with SERIALIZABLE / REPEATABLE_READ isolation
     * - Java synchronization block to eliminate in-memory race conditions
     * - Parameterized overlap SQL check
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Booking createBooking(BookingRequest request) {
        // Validation 1: Date in past check
        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingException("Cannot create a booking in the past: " + request.getBookingDate());
        }

        // Validation 2: Time range consistency
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new InvalidBookingException("Start time (" + request.getStartTime() + ") must be before end time (" + request.getEndTime() + ")");
        }

        synchronized (BOOKING_LOCK) {
            // Validation 3: Check for overlapping bookings
            List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                    request.getResourceType(),
                    request.getResourceId(),
                    request.getBookingDate(),
                    request.getStartTime(),
                    request.getEndTime()
            );

            if (!conflicts.isEmpty()) {
                throw new BookingConflictException(String.format(
                        "Resource conflict: %s (ID %d) is already booked on %s between %s and %s.",
                        request.getResourceType(), request.getResourceId(), request.getBookingDate(),
                        conflicts.get(0).getStartTime(), conflicts.get(0).getEndTime()
                ));
            }

            Booking booking = new Booking();
            booking.setUserId(request.getUserId());
            booking.setResourceType(request.getResourceType());
            booking.setResourceId(request.getResourceId());
            booking.setBookingDate(request.getBookingDate());
            booking.setStartTime(request.getStartTime());
            booking.setEndTime(request.getEndTime());
            booking.setPurpose(request.getPurpose());
            booking.setStatus("CONFIRMED");
            booking.setCheckInStatus("NOT_CHECKED_IN");

            Long bookingId = bookingRepository.save(booking);
            booking.setBookingId(bookingId);

            notificationService.sendNotification(
                    request.getUserId(),
                    "Booking Confirmed",
                    "Your booking for " + request.getResourceType() + " on " + request.getBookingDate() + " (" + request.getStartTime() + " - " + request.getEndTime() + ") has been confirmed.",
                    "BOOKING",
                    "/bookings"
            );

            activityLogRepository.log(request.getUserId(), "BOOKING_CONFIRMED", "BOOKING", 
                    "Booked " + request.getResourceType() + " #" + request.getResourceId() + " on " + request.getBookingDate());

            return booking;
        }
    }

    /**
     * Cancels an existing booking and immediately triggers the Campus Resource Rescue Engine.
     */
    @Transactional
    public Booking cancelBooking(Long bookingId, Long requestingUserId) {
        Booking booking = getBookingById(bookingId);
        bookingRepository.updateStatus(bookingId, "CANCELLED");
        booking.setStatus("CANCELLED");

        notificationService.sendNotification(
                booking.getUserId(),
                "Booking Cancelled",
                "Your booking #" + bookingId + " for " + booking.getResourceType() + " on " + booking.getBookingDate() + " has been cancelled.",
                "BOOKING",
                "/bookings"
        );

        activityLogRepository.log(requestingUserId, "BOOKING_CANCELLED", "BOOKING", "Cancelled booking ID: " + bookingId);

        // TRIGGER THE SIGNATURE INNOVATION: AUTOMATIC SLOT RECOVERY
        rescueEngineService.handleCancelledSlot(
                booking.getResourceType(),
                booking.getResourceId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        return booking;
    }

    @Transactional
    public void updateStatus(Long bookingId, String status) {
        bookingRepository.updateStatus(bookingId, status);
        if ("CANCELLED".equalsIgnoreCase(status) || "REJECTED".equalsIgnoreCase(status)) {
            Booking b = getBookingById(bookingId);
            rescueEngineService.handleCancelledSlot(b.getResourceType(), b.getResourceId(), b.getBookingDate(), b.getStartTime(), b.getEndTime());
        }
    }

    public byte[] exportBookingAudit() {
        return ReportGenerator.generateBookingAuditCsv(getAllBookings());
    }
}
