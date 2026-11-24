package com.smartcampus.util;

import com.smartcampus.model.WaitingListEntry;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.Optional;
import java.util.PriorityQueue;

/**
 * Intelligent Slot Matching Engine utilizing Java Collections & PriorityQueue.
 * 
 * Demonstrates:
 * - PriorityQueue data structure with natural / custom ordering
 * - Multi-criteria priority evaluation (Urgency, Academic Role, Timestamp)
 * - Safe null checks and immutable slot verification
 */
public class PrioritySlotMatcher {

    /**
     * Finds the highest-ranked waiting-list entry matching the released time slot.
     */
    public static Optional<WaitingListEntry> findBestMatch(
            Collection<WaitingListEntry> entries, 
            String resourceType, 
            Long resourceId, 
            LocalDate date, 
            LocalTime startTime, 
            LocalTime endTime) {

        if (entries == null || entries.isEmpty()) {
            return Optional.empty();
        }

        // PriorityQueue automatically orders by WaitingListEntry.compareTo()
        PriorityQueue<WaitingListEntry> queue = new PriorityQueue<>();

        for (WaitingListEntry entry : entries) {
            if ("WAITING".equalsIgnoreCase(entry.getStatus()) &&
                entry.getResourceType().equalsIgnoreCase(resourceType) &&
                entry.getResourceId().equals(resourceId) &&
                entry.isCompatibleWithSlot(date, startTime, endTime)) {
                queue.offer(entry);
            }
        }

        return Optional.ofNullable(queue.poll());
    }
}
