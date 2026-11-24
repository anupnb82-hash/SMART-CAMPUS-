package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.CampusEvent;
import com.smartcampus.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampusEvent>>> getAllEvents(@RequestParam(required = false) Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("Events retrieved", eventService.getAllEvents(userId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampusEvent>> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Event details", eventService.getEventById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CampusEvent>> createEvent(@RequestBody CampusEvent event) {
        CampusEvent created = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Event created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampusEvent>> updateEvent(@PathVariable Long id, @RequestBody CampusEvent event) {
        CampusEvent updated = eventService.updateEvent(id, event);
        return ResponseEntity.ok(ApiResponse.ok("Event updated", updated));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<String>> registerForEvent(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        boolean success = eventService.registerUser(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Successfully registered for event", "Event #" + id));
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<ApiResponse<String>> cancelRegistration(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long userId) {
        eventService.cancelRegistration(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Event registration cancelled", "Event #" + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully", "ID " + id));
    }
}
