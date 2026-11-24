# SMART CAMPUS INTEGRATED MANAGEMENT SYSTEM
## REST API Specification & Endpoint Documentation

All endpoints return unified JSON structures using `ApiResponse<T>`:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-11-04T10:00:00"
}
```

### 1. Authentication Endpoints
- `POST /api/auth/login`: Authenticates with email and password, returning profile and token.
- `POST /api/auth/logout`: Invalidates session.

### 2. Student Endpoints
- `GET /api/students`: Retrieve all students with optional `search`, `departmentId`, `year` filters.
- `GET /api/students/{id}`: Retrieve detailed student profile.
- `POST /api/students`: Create new student and user account.
- `PUT /api/students/{id}`: Update student details.
- `DELETE /api/students/{id}`: Deactivate student record.
- `GET /api/students/export/csv`: Export student roster to CSV.

### 3. Faculty Endpoints
- `GET /api/faculty`: Retrieve faculty directory with search and department filtering.
- `GET /api/faculty/{id}`: Retrieve faculty member details.
- `POST /api/faculty`: Register new faculty member.
- `PUT /api/faculty/{id}`: Update faculty record.
- `DELETE /api/faculty/{id}`: Deactivate faculty member.

### 4. Department Endpoints
- `GET /api/departments`: List all departments with computed student/faculty/course counts.
- `POST /api/departments`: Create department.
- `PUT /api/departments/{id}`: Update department.
- `DELETE /api/departments/{id}`: Safe delete (checks for dependent records first).

### 5. Course Endpoints
- `GET /api/courses`: List all courses.
- `GET /api/courses/faculty/{facultyId}`: List courses assigned to faculty.
- `GET /api/courses/student/{studentId}`: List courses enrolled by student.
- `POST /api/courses`: Create course.
- `PUT /api/courses/{id}`: Update course and schedule.
- `DELETE /api/courses/{id}`: Delete course.

### 6. Resource Endpoints
- `GET /api/resources`: Retrieve classrooms, laboratories, and equipment in a single bundle.
- `GET /api/resources/{id}/recommendations`: Retrieve alternative compatible classrooms.
- `POST /api/resources/classrooms`: Create classroom.
- `POST /api/resources/laboratories`: Create laboratory.
- `POST /api/resources/equipment`: Create equipment.

### 7. Booking & Rescue Engine Endpoints
- `GET /api/bookings`: Retrieve all bookings or filter by `userId`.
- `POST /api/bookings`: Create confirmed reservation with concurrency conflict protection.
- `DELETE /api/bookings/{id}`: Cancel booking and release slot to Rescue Engine.
- `POST /api/waiting-list`: Join smart waitlist with priority ranking.
- `GET /api/waiting-list`: Retrieve waiting list entries.
- `GET /api/slot-offers`: View recovery slot offers.
- `POST /api/slot-offers/{id}/accept`: Accept offer and confirm into booking.
- `POST /api/slot-offers/{id}/reject`: Decline offer and notify next in line.
- `POST /api/rescue-engine/check-in`: Room check-in stopping no-show timer.
- `POST /api/rescue-engine/check-out`: Room check-out.
- `GET /api/rescue-engine/analytics`: Retrieve recovery KPIs and utilization rates.

### 8. Campus Events & Assignments
- `GET /api/events`: List events with registration status.
- `POST /api/events/{id}/register`: Register for event with capacity enforcement.
- `DELETE /api/events/{id}/register`: Cancel event registration.
- `GET /api/assignments`: List assignments.
- `POST /api/assignments/{id}/submit`: Submit assignment solution.
- `POST /api/assignments/submissions/{subId}/grade`: Grade student submission with feedback.

### 9. Notifications & Dashboard
- `GET /api/notifications`: Retrieve user notifications.
- `PUT /api/notifications/{id}/read`: Mark notification read.
- `GET /api/dashboard/stats`: Retrieve live aggregate MySQL statistics.
- `GET /api/dashboard/recent-activity`: Audit log stream.
