package com.smartcampus;

import com.smartcampus.model.WaitingListEntry;
import com.smartcampus.util.PrioritySlotMatcher;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.PriorityQueue;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Campus Resource Rescue Engine PriorityQueue & Recovery Test")
public class RescueEnginePriorityQueueTest {

    @Test
    @DisplayName("Should rank urgent examination priority ahead of standard student reservation")
    public void testPriorityQueueOrdering() {
        PriorityQueue<WaitingListEntry> queue = new PriorityQueue<>();

        WaitingListEntry normalStudent = new WaitingListEntry(
                1L, 4L, "LABORATORY", 1L,
                LocalDate.now(), LocalTime.of(14, 0), LocalTime.of(16, 0),
                "General Study", 1
        );
        normalStudent.setCreatedAt(LocalDateTime.now().minusHours(2));

        WaitingListEntry urgentFaculty = new WaitingListEntry(
                2L, 2L, "LABORATORY", 1L,
                LocalDate.now(), LocalTime.of(14, 0), LocalTime.of(16, 0),
                "Accreditation Practical Exam", 3
        );
        urgentFaculty.setCreatedAt(LocalDateTime.now().minusMinutes(10)); // Created later, but higher priority

        queue.offer(normalStudent);
        queue.offer(urgentFaculty);

        // Highest priority should be retrieved first
        WaitingListEntry first = queue.poll();
        assertNotNull(first);
        assertEquals(3, first.getPriority());
        assertEquals("Accreditation Practical Exam", first.getPurpose());

        WaitingListEntry second = queue.poll();
        assertNotNull(second);
        assertEquals(1, second.getPriority());
    }

    @Test
    @DisplayName("Should break priority ties using FIFO request timestamp")
    public void testPriorityQueueFifoTieBreaking() {
        PriorityQueue<WaitingListEntry> queue = new PriorityQueue<>();

        LocalDateTime time1 = LocalDateTime.now().minusHours(1);
        LocalDateTime time2 = LocalDateTime.now().minusMinutes(20);

        WaitingListEntry earlyRequest = new WaitingListEntry(
                10L, 4L, "CLASSROOM", 1L,
                LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(11, 30),
                "Study Group Alpha", 2
        );
        earlyRequest.setCreatedAt(time1);

        WaitingListEntry laterRequest = new WaitingListEntry(
                11L, 5L, "CLASSROOM", 1L,
                LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(11, 30),
                "Study Group Beta", 2
        );
        laterRequest.setCreatedAt(time2);

        queue.offer(laterRequest);
        queue.offer(earlyRequest);

        // Both priority 2, but earlyRequest was created first
        WaitingListEntry polled = queue.poll();
        assertNotNull(polled);
        assertEquals(10L, polled.getWaitId());
    }

    @Test
    @DisplayName("Should accurately detect compatible released slot using PrioritySlotMatcher")
    public void testSlotMatchingAlgorithm() {
        List<WaitingListEntry> entries = new ArrayList<>();

        WaitingListEntry entry = new WaitingListEntry(
                1L, 5L, "LABORATORY", 1L,
                LocalDate.now(), LocalTime.of(14, 0), LocalTime.of(16, 0),
                "Deep Learning Run", 2
        );
        entry.setStatus("WAITING");
        entries.add(entry);

        Optional<WaitingListEntry> match = PrioritySlotMatcher.findBestMatch(
                entries, "LABORATORY", 1L, LocalDate.now(), LocalTime.of(14, 0), LocalTime.of(16, 0)
        );

        assertTrue(match.isPresent());
        assertEquals(1L, match.get().getWaitId());
    }
}
