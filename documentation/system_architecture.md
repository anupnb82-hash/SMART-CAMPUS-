# SMART CAMPUS INTEGRATED MANAGEMENT SYSTEM
## System Architecture & Engineering Blueprint

### 1. High-Level Architecture Overview
The Smart Campus Integrated Management System follows a 3-tier enterprise architecture built on strict Object-Oriented principles, separation of concerns, and relational data persistence:

```
+-----------------------------------------------------------------------+
|                           PRESENTATION TIER                           |
|  - University SaaS Interface (Desktop & Mobile Responsive)            |
|  - Role-Based Portals: Student, Faculty, Administrator                |
|  - Real-Time Rescue Engine Console & Alternative Room Visualizer     |
+-----------------------------------------------------------------------+
                                   | REST / JSON
                                   v
+-----------------------------------------------------------------------+
|                          APPLICATION / LOGIC                          |
|  - Spring Boot 3.x REST Controllers                                   |
|  - Security & Authentication Layer (BCrypt + Role Guards)             |
|  - Business Services (Booking, Student, Faculty, Academic, Life)      |
|  - Campus Resource Rescue Engine (PriorityQueue & Slot Matcher)       |
+-----------------------------------------------------------------------+
                                   | Spring JdbcTemplate
                                   v
+-----------------------------------------------------------------------+
|                            DATA PERSISTENCE                           |
|  - MySQL 8 Relational Database (19 Normalized Tables)                |
|  - Parameterized Queries & ACID Transactions                          |
|  - Concurrency Locking (REPEATABLE READ & Synchronized Locks)         |
+-----------------------------------------------------------------------+
```

### 2. Tier Specifications

#### A. Controller Layer (`com.smartcampus.controller`)
- Exposes RESTful endpoints conforming to standard HTTP semantics (`GET`, `POST`, `PUT`, `DELETE`).
- Validates request payloads and maps them to generic `ApiResponse<T>` containers.
- Enforces role-based endpoint security guards.

#### B. Service Layer (`com.smartcampus.service`)
- Houses all core business rules and transaction orchestration (`@Transactional`).
- Houses the **Signature Innovation**: `CampusResourceRescueEngineService`, which coordinates:
  - Waitlist entry registration with priorities
  - Automatic slot recovery on booking cancellation
  - Priority-based allocation matrix
  - Check-in / Check-out and automated No-Show detection (15-minute grace period)

#### C. Data Access Layer (`com.smartcampus.repository`)
- Pure Spring `JdbcTemplate` implementation.
- Employs SQL parameterized queries with `PreparedStatement` to guarantee SQL injection immunity.
- Uses `RowMapper` functional interfaces to map relational tables to strongly-typed model objects.

#### D. Database Layer (`database/smart_campus.sql`)
- 19 third-normal-form (3NF) relational tables in MySQL 8.
- Foreign key constraints with explicit referential action rules (`ON DELETE CASCADE`, `ON DELETE RESTRICT`).
- Performance indexes on foreign keys, schedule ranges, and search columns.
