package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.BookingRequest;
import com.smartcampus.model.Booking;
import com.smartcampus.service.BookingService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings(@RequestParam(required = false) Long userId) {
        List<Booking> list = userId != null ? bookingService.getBookingsByUserId(userId) : bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.ok("Bookings retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Booking details", bookingService.getBookingById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Resource booked successfully", booking));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<String>> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        bookingService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated to " + status, "ID " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        Booking cancelled = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled and slot released to Rescue Engine", cancelled));
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportBookingsCsv() {
        byte[] csv = bookingService.exportBookingAudit();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"campus_bookings_audit.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
