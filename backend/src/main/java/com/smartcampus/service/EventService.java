package com.smartcampus.service;

import com.smartcampus.model.CampusEvent;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final ActivityLogRepository activityLogRepository;

    public EventService(EventRepository eventRepository,
                        NotificationService notificationService,
                        ActivityLogRepository activityLogRepository) {
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
        this.activityLogRepository = activityLogRepository;
    }

    public List<CampusEvent> getAllEvents(Long currentUserId) {
        List<CampusEvent> events = eventRepository.findAll();
        if (currentUserId != null) {
            for (CampusEvent e : events) {
                e.setRegistered(eventRepository.isUserRegistered(e.getEventId(), currentUserId));
            }
        }
        return events;
    }

    public CampusEvent getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));
    }

    @Transactional
    public CampusEvent createEvent(CampusEvent event) {
        Long id = eventRepository.save(event);
        event.setEventId(id);
        activityLogRepository.log(event.getOrganizerUserId(), "EVENT_CREATED", "CAMPUS_LIFE", 
                "Created event " + event.getEventName() + " on " + event.getEventDate());
        return event;
    }

    @Transactional
    public CampusEvent updateEvent(Long eventId, CampusEvent update) {
        CampusEvent existing = getEventById(eventId);
        existing.setEventName(update.getEventName());
        existing.setDescription(update.getDescription());
        existing.setEventDate(update.getEventDate());
        existing.setStartTime(update.getStartTime());
        existing.setEndTime(update.getEndTime());
        existing.setVenue(update.getVenue());
        existing.setCategory(update.getCategory());
        existing.setMaxParticipants(update.getMaxParticipants());
        existing.setStatus(update.getStatus());

        eventRepository.update(existing);
        activityLogRepository.log(existing.getOrganizerUserId(), "EVENT_UPDATED", "CAMPUS_LIFE", "Updated event ID: " + eventId);
        return existing;
    }

    @Transactional
    public boolean registerUser(Long eventId, Long userId) {
        CampusEvent event = getEventById(eventId);
        if (!event.hasSpace()) {
            throw new IllegalStateException("Event capacity reached (" + event.getMaxParticipants() + " max participants).");
        }

        boolean success = eventRepository.registerUser(eventId, userId);
        if (success) {
            notificationService.sendNotification(
                    userId,
                    "Event Registration Confirmed",
                    "You are registered for " + event.getEventName() + " on " + event.getEventDate() + " at " + event.getVenue() + ".",
                    "EVENT",
                    "/events"
            );
            activityLogRepository.log(userId, "EVENT_REGISTERED", "CAMPUS_LIFE", "Registered for event #" + eventId);
        }
        return success;
    }

    @Transactional
    public boolean cancelRegistration(Long eventId, Long userId) {
        boolean success = eventRepository.cancelRegistration(eventId, userId);
        if (success) {
            activityLogRepository.log(userId, "EVENT_CANCELLED", "CAMPUS_LIFE", "Cancelled registration for event #" + eventId);
        }
        return success;
    }

    @Transactional
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }
}
