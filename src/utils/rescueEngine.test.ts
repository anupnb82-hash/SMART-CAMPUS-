import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkIntervalOverlap,
  hasBookingConflict,
  rankWaitingList,
  findBestWaitingCandidate,
  recommendAlternativeClassrooms,
  isGracePeriodExceeded,
  calculateUtilizationMetrics,
  BookingSlot,
  WaitingListRequest,
  ClassroomResource,
} from './rescueEngine';

test('checkIntervalOverlap: accurately identifies overlapping intervals', () => {
  // 10:00 to 12:00 vs 11:00 to 13:00 (overlaps)
  assert.equal(checkIntervalOverlap('10:00', '12:00', '11:00', '13:00'), true);

  // 10:00 to 12:00 vs 12:00 to 14:00 (back-to-back, does not overlap)
  assert.equal(checkIntervalOverlap('10:00', '12:00', '12:00', '14:00'), false);

  // 14:00 to 15:00 vs 09:00 to 11:00 (completely distinct)
  assert.equal(checkIntervalOverlap('14:00', '15:00', '09:00', '11:00'), false);

  // Enclosing interval: 09:00 to 17:00 vs 12:00 to 13:00
  assert.equal(checkIntervalOverlap('09:00', '17:00', '12:00', '13:00'), true);
});

test('hasBookingConflict: identifies collisions for same resource and date only', () => {
  const existing: BookingSlot[] = [
    {
      id: 1,
      resourceType: 'CLASSROOM',
      resourceId: 101,
      date: '2026-11-10',
      startTime: '10:00',
      endTime: '12:00',
      status: 'CONFIRMED',
    },
    {
      id: 2,
      resourceType: 'CLASSROOM',
      resourceId: 101,
      date: '2026-11-10',
      startTime: '14:00',
      endTime: '16:00',
      status: 'CANCELLED',
    },
  ];

  // Conflict with confirmed booking
  assert.equal(
    hasBookingConflict(existing, 'CLASSROOM', 101, '2026-11-10', '11:00', '12:30'),
    true
  );

  // No conflict on different date
  assert.equal(
    hasBookingConflict(existing, 'CLASSROOM', 101, '2026-11-11', '11:00', '12:30'),
    false
  );

  // No conflict on different resource
  assert.equal(
    hasBookingConflict(existing, 'CLASSROOM', 102, '2026-11-10', '11:00', '12:30'),
    false
  );

  // No conflict with CANCELLED booking slot
  assert.equal(
    hasBookingConflict(existing, 'CLASSROOM', 101, '2026-11-10', '14:30', '15:30'),
    false
  );
});

test('rankWaitingList: sorts by priority descending and ties by FIFO timestamp', () => {
  const candidates: WaitingListRequest[] = [
    {
      id: 1,
      userId: 10,
      userName: 'Student A',
      resourceType: 'LABORATORY',
      resourceId: 1,
      date: '2026-11-10',
      startTime: '14:00',
      endTime: '16:00',
      priority: 1,
      createdAt: '2026-11-10T08:00:00Z',
      status: 'WAITING',
      autoAllocateOptIn: true,
    },
    {
      id: 2,
      userId: 20,
      userName: 'Faculty Exam B',
      resourceType: 'LABORATORY',
      resourceId: 1,
      date: '2026-11-10',
      startTime: '14:00',
      endTime: '16:00',
      priority: 3,
      createdAt: '2026-11-10T09:30:00Z',
      status: 'WAITING',
      autoAllocateOptIn: true,
    },
    {
      id: 3,
      userId: 30,
      userName: 'Student C',
      resourceType: 'LABORATORY',
      resourceId: 1,
      date: '2026-11-10',
      startTime: '14:00',
      endTime: '16:00',
      priority: 1,
      createdAt: '2026-11-10T07:30:00Z', // Created before Student A
      status: 'WAITING',
      autoAllocateOptIn: true,
    },
  ];

  const ranked = rankWaitingList(candidates);
  assert.equal(ranked[0].id, 2); // Priority 3 wins first
  assert.equal(ranked[1].id, 3); // Priority 1 with earlier timestamp (07:30) wins next
  assert.equal(ranked[2].id, 1); // Priority 1 with later timestamp (08:00) is last
});

test('findBestWaitingCandidate: finds top matching candidate for released slot', () => {
  const candidates: WaitingListRequest[] = [
    {
      id: 101,
      userId: 5,
      userName: 'Alice',
      resourceType: 'CLASSROOM',
      resourceId: 1,
      date: '2026-11-15',
      startTime: '10:00',
      endTime: '11:30',
      priority: 2,
      createdAt: '2026-11-10T09:00:00Z',
      status: 'WAITING',
      autoAllocateOptIn: true,
    },
    {
      id: 102,
      userId: 6,
      userName: 'Bob',
      resourceType: 'CLASSROOM',
      resourceId: 1,
      date: '2026-11-15',
      startTime: '10:00',
      endTime: '11:00',
      priority: 3, // Higher priority
      createdAt: '2026-11-10T10:00:00Z',
      status: 'WAITING',
      autoAllocateOptIn: true,
    },
  ];

  const best = findBestWaitingCandidate(candidates, 'CLASSROOM', 1, '2026-11-15', '09:00', '12:00');
  assert.notEqual(best, null);
  assert.equal(best?.id, 102);
});

test('recommendAlternativeClassrooms: filters by capacity and projector criteria', () => {
  const rooms: ClassroomResource[] = [
    { id: 1, roomNumber: 'ATH-101', building: 'Turing', capacity: 60, hasProjector: true, hasAirConditioning: true, status: 'AVAILABLE' },
    { id: 2, roomNumber: 'ATH-102', building: 'Turing', capacity: 40, hasProjector: false, hasAirConditioning: true, status: 'AVAILABLE' },
    { id: 3, roomNumber: 'NTT-201', building: 'Tesla', capacity: 80, hasProjector: true, hasAirConditioning: true, status: 'AVAILABLE' },
    { id: 4, roomNumber: 'NTT-202', building: 'Tesla', capacity: 100, hasProjector: true, hasAirConditioning: true, status: 'MAINTENANCE' },
  ];

  // Requesting alternative for Room 1 with minimum capacity of 50 and required projector
  const recs = recommendAlternativeClassrooms(rooms, 1, 50, true);
  assert.equal(recs.length, 1);
  assert.equal(recs[0].id, 3); // NTT-201 matches (capacity 80, projector true, not maintenance)
});

test('isGracePeriodExceeded: calculates 15-minute grace period threshold correctly', () => {
  const start = '2026-11-04T10:00:00Z';
  // 10 minutes in - still within grace period
  assert.equal(isGracePeriodExceeded(start, '2026-11-04T10:10:00Z', 15), false);
  // 16 minutes in - exceeded!
  assert.equal(isGracePeriodExceeded(start, '2026-11-04T10:16:00Z', 15), true);
});

test('calculateUtilizationMetrics: calculates rate and recovery efficiency', () => {
  const metrics = calculateUtilizationMetrics(100, 80, 10, 12);
  assert.equal(metrics.utilizationRate, 90);
  assert.equal(metrics.recoveryEfficiencyPct, 83);
});
