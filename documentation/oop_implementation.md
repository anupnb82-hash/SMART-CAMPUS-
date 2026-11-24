# SMART CAMPUS INTEGRATED MANAGEMENT SYSTEM
## Java OOP Concept Implementation & Academic PBL Mapping

This document provides an exhaustive mapping of Object-Oriented Programming (OOP) concepts implemented across the Smart Campus application codebase for academic evaluation and viva defense.

---

### 1. Classes and Objects
- **Person** (`com.smartcampus.model.Person`): Root abstract entity modeling university constituents.
- **Student** (`com.smartcampus.model.Student`): Concrete entity representing enrolled students.
- **Faculty** (`com.smartcampus.model.Faculty`): Concrete entity representing academic faculty.
- **Department** (`com.smartcampus.model.Department`): Represents academic divisions and facilities.
- **Course** (`com.smartcampus.model.Course`): Represents university courses and schedules.
- **Classroom** (`com.smartcampus.model.Classroom`): Physical lecture halls and learning spaces.
- **Laboratory** (`com.smartcampus.model.Laboratory`): Specialized scientific and computing labs.
- **Equipment** (`com.smartcampus.model.Equipment`): High-value research instrumentation and workstations.
- **Booking** (`com.smartcampus.model.Booking`): Transactional reservations of campus assets.
- **CampusEvent** (`com.smartcampus.model.CampusEvent`): University conferences and hackathons.
- **Assignment** (`com.smartcampus.model.Assignment`): Academic deliverables and evaluations.

---

### 2. Constructors
- **Default Constructors**: Parameterless constructors initializing default state (e.g., status `'ACTIVE'`, timestamps, default capacity) in `Person`, `Student`, `Faculty`, `Classroom`, `Booking`.
- **Parameterized Constructors**: Overloaded constructors enabling atomic instantiation with initial parameters in `Person(id, userId, fullName, email, phone, departmentId)`, `Student(...)`, `Faculty(...)`.

---

### 3. Encapsulation
- **Private Fields**: All state variables in models (`fullName`, `email`, `cgpa`, `capacity`) are strictly `private`.
- **Public Accessors & Mutators**: Standard getters and validated setters:
  - Email format validation in `Person.setEmail()`
  - Non-blank checks in `Person.setFullName()`
  - Safe immutable time intervals in `Booking.overlapsWith()`

---

### 4. Inheritance
- **Abstract Superclass**: `com.smartcampus.model.Person` defines common member attributes (`userId`, `fullName`, `email`, `phone`, `departmentId`).
- **Subclasses**:
  - `class Student extends Person`
  - `class Faculty extends Person`
- **Reuse**: Eliminates duplicate code across user types while allowing specialized behavior.

---

### 5. Polymorphism
- **Dynamic Method Overriding (`@Override`)**:
  - Abstract method `public abstract String getRoleDescription();` declared in `Person`.
  - Overridden in `Student`: returns `"Undergraduate Student (Year X, Sem Y)"`.
  - Overridden in `Faculty`: returns `"Faculty Member: Designation (Specialization)"`.
  - Polymorphic invocation in `Person.getDisplaySummary()`.
- **Static Method Overloading**:
  - In `Student`: `getAcademicStanding()` without parameters and `getAcademicStanding(BigDecimal customCgpa)`.

---

### 6. Abstraction
- Abstract class `Person` cannot be instantiated directly; defines the conceptual template for all campus personnel.
- Abstract contract methods enforce compliance without dictating internal subclass implementation.

---

### 7. Interfaces
- **Bookable** (`com.smartcampus.interfaces.Bookable`):
  - Methods: `getResourceId()`, `getResourceName()`, `getResourceType()`, `isAvailable()`, `getCapacity()`.
  - Implemented by: `Classroom`, `Laboratory`, `Equipment`.
- **Manageable** (`com.smartcampus.interfaces.Manageable`):
  - Methods: `getIdentifier()`, `getStatus()`, `setStatus()`, `isActive()`.
  - Implemented by: `Classroom`, `Laboratory`, `Equipment`.
- **Notifiable** (`com.smartcampus.interfaces.Notifiable`):
  - Methods: `getRecipientUserId()`, `getNotificationTitle()`, `getNotificationBody()`, `isUrgent()`.
  - Implemented by: `Notification`.

---

### 8. Custom Exception Handling
Centralized exception handling with `@RestControllerAdvice` in `com.smartcampus.exception.GlobalExceptionHandler`:
- `StudentNotFoundException` (HTTP 404)
- `FacultyNotFoundException` (HTTP 404)
- `CourseNotFoundException` (HTTP 404)
- `ResourceNotFoundException` (HTTP 404)
- `BookingConflictException` (HTTP 409 Conflict)
- `InvalidBookingException` (HTTP 400 Bad Request)
- `DatabaseOperationException` (HTTP 500 Internal Error)

---

### 9. Multithreading & Synchronization
- **Concurrent Booking Protection**: `BookingService.java` protects against race conditions using a synchronized lock object (`synchronized (BOOKING_LOCK)`) coupled with database transaction isolation (`@Transactional(isolation = Isolation.REPEATABLE_READ)`).
- **Background Scheduled Tasks**: `@Scheduled(fixedRate = 60000)` in `CampusResourceRescueEngineService.scanAndReleaseNoShows()` executes periodically on a background worker thread.

---

### 10. Collections Framework
- **ArrayList / List**: Utilized across all repositories and services for tabular record storage and transformation.
- **HashMap / Map**: Used in `DashboardController` and `ApiResponse` for dynamic metric packaging and JSON response maps.
- **HashSet / Set**: Used in `FileUploadUtil` and course enrollment validation for $O(1)$ membership checks.
- **PriorityQueue**: The cornerstone of the **Campus Resource Rescue Engine** (`PrioritySlotMatcher.java`):
  - Orders waiting-list candidates automatically using `Comparable<WaitingListEntry>`.
  - Priority criteria: Urgency rating (3 = Exam, 2 = Faculty Academic, 1 = Normal) descending, with FIFO timestamp tie-breaking.

---

### 11. Generics
- `ApiResponse<T>`: Type-safe generic wrapper for REST API responses (`com.smartcampus.dto.ApiResponse`).
- `GenericRepository<T, ID>`: Standardized generic repository interface (`com.smartcampus.util.GenericRepository`).

---

### 12. Lambda Expressions & Stream API
Implemented in `com.smartcampus.util.StreamFilters`, `StudentService`, and `ResourceService`:
- Filtering honor students: `students.stream().filter(s -> s.getCgpa() >= minCgpa)...`
- Grouping course credits: `courses.stream().collect(Collectors.groupingBy(...))`
- Alternative room matching: `allRooms.stream().filter(...).sorted(...).limit(5)`

---

### 13. File Handling
- **FileUploadUtil** (`com.smartcampus.util.FileUploadUtil`): Validates file size, allowed extensions (`.pdf`, `.zip`, `.java`), and saves files safely to `uploads/` directory.
- **ReportGenerator** (`com.smartcampus.util.ReportGenerator`): Generates student roster and booking audit CSV exports using `ByteArrayOutputStream` and `PrintWriter`.

---

### 14. JDBC & Parameterized Queries
- Built strictly with Spring `JdbcTemplate` (no Hibernate/JPA).
- Parameterized SQL statements with `PreparedStatement` prevent SQL injection vulnerabilities.
- Explicit `RowMapper` implementations for complete control over relational-to-object mapping.
