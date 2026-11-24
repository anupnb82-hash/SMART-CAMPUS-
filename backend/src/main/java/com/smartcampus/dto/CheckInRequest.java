package com.smartcampus.dto;

public class CheckInRequest {
    private Long bookingId;
    private Long userId;

    public CheckInRequest() {}

    public CheckInRequest(Long bookingId, Long userId) {
        this.bookingId = bookingId;
        this.userId = userId;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
