# SMART CAMPUS INTEGRATED MANAGEMENT SYSTEM
## Database Design & Relational Schema Specification

### 1. Database Overview
- **Database Engine**: MySQL 8.0+ / InnoDB
- **Database Name**: `smart_campus`
- **Encoding**: `utf8mb4` with collation `utf8mb4_unicode_ci`
- **Referential Integrity**: Fully enforced foreign keys with `CASCADE` and `RESTRICT` rules.

### 2. Entity-Relationship Schema Map
The database consists of 19 normalized tables:

1. **users**: Primary credentials, roles (`ADMIN`, `FACULTY`, `STUDENT`), and account status.
2. **departments**: Academic departments, facilities, buildings, and leadership.
3. **students**: Student profile, roll number, academic year, semester, CGPA (FK to `users`, `departments`).
4. **faculty**: Faculty profile, designation, office room, specialization (FK to `users`, `departments`).
5. **courses**: Course code, title, credits, semester, schedule (FK to `departments`, `faculty`).
6. **student_courses**: Course enrollments, grades, and attendance tracking.
7. **classrooms**: Room number, building, floor, capacity, projectors, smartboard, air conditioning.
8. **laboratories**: Lab facilities, capacity, department, safety certification levels.
9. **equipment**: High-value devices, workstations, condition status, available counts.
10. **bookings**: Reservations with exact date, start/end time, purpose, and check-in status.
11. **waiting_list**: Waiting queue entries with priority (1=Normal, 2=Faculty, 3=Exam/Urgent).
12. **slot_offers**: Time-bound slot recovery offers dispatched by the Rescue Engine.
13. **resource_checkins**: Check-in audit logs, grace period verification, no-show detection.
14. **events**: University hackathons, guest lectures, venues, and capacity limits.
15. **event_registrations**: Attendee registrations linked to events and users.
16. **assignments**: Academic coursework created by faculty with deadlines.
17. **assignment_submissions**: Submissions uploaded by students with grades and feedback.
18. **notifications**: In-app alerts for bookings, slot offers, assignments, and deadlines.
19. **activity_logs**: Comprehensive audit log recording actions, user IDs, and timestamps.
