package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.CheckInRequest;
import com.smartcampus.dto.WaitingListRequest;
import com.smartcampus.model.SlotOffer;
import com.smartcampus.model.WaitingListEntry;
import com.smartcampus.service.CampusResourceRescueEngineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RescueEngineController {

    private final CampusResourceRescueEngineService rescueEngineService;

    public RescueEngineController(CampusResourceRescueEngineService rescueEngineService) {
        this.rescueEngineService = rescueEngineService;
    }

    // ================= WAITING LIST =================
    @PostMapping("/waiting-list")
    public ResponseEntity<ApiResponse<WaitingListEntry>> joinWaitingList(@RequestBody WaitingListRequest request) {
        WaitingListEntry entry = rescueEngineService.joinWaitingList(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Added to Smart Waiting List with Priority " + entry.getPriority(), entry));
    }

    @GetMapping("/waiting-list")
    public ResponseEntity<ApiResponse<List<WaitingListEntry>>> getWaitingList() {
        return ResponseEntity.ok(ApiResponse.ok("Waiting list entries", rescueEngineService.getAllWaitingListEntries()));
    }

    // ================= SLOT OFFERS =================
    @GetMapping("/slot-offers")
    public ResponseEntity<ApiResponse<List<SlotOffer>>> getSlotOffers(@RequestParam(required = false) Long userId) {
        List<SlotOffer> offers = userId != null ? rescueEngineService.getOffersForUser(userId) : rescueEngineService.getAllOffers();
        return ResponseEntity.ok(ApiResponse.ok("Slot offers", offers));
    }

    @PostMapping("/slot-offers/{id}/accept")
    public ResponseEntity<ApiResponse<String>> acceptSlotOffer(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        rescueEngineService.acceptSlotOffer(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Slot offer accepted and confirmed into booking", "Offer #" + id));
    }

    @PostMapping("/slot-offers/{id}/reject")
    public ResponseEntity<ApiResponse<String>> rejectSlotOffer(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        rescueEngineService.declineSlotOffer(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Slot offer declined; next candidate notified", "Offer #" + id));
    }

    // ================= CHECK-IN / CHECK-OUT / NO-SHOW AUDIT =================
    @PostMapping("/rescue-engine/check-in")
    public ResponseEntity<ApiResponse<String>> checkIn(@RequestBody CheckInRequest request) {
        rescueEngineService.checkIn(request.getBookingId(), request.getUserId());
        return ResponseEntity.ok(ApiResponse.ok("Resource check-in successful. No-show timer stopped.", "Booking #" + request.getBookingId()));
    }

    @PostMapping("/rescue-engine/check-out")
    public ResponseEntity<ApiResponse<String>> checkOut(@RequestBody CheckInRequest request) {
        rescueEngineService.checkOut(request.getBookingId(), request.getUserId());
        return ResponseEntity.ok(ApiResponse.ok("Resource check-out successful. Slot logged completed.", "Booking #" + request.getBookingId()));
    }

    @PostMapping("/rescue-engine/scan-no-shows")
    public ResponseEntity<ApiResponse<String>> scanNoShows() {
        rescueEngineService.scanAndReleaseNoShows();
        return ResponseEntity.ok(ApiResponse.ok("Scanned bookings for grace period expirations", "Audit complete"));
    }

    // ================= ANALYTICS =================
    @GetMapping("/rescue-engine/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok("Resource Rescue Engine Analytics", rescueEngineService.calculateUtilizationAnalytics()));
    }
}
