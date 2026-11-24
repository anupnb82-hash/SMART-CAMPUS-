# SMART CAMPUS INTEGRATED MANAGEMENT SYSTEM
### Complete Full-Stack University Management Platform & Java OOP PBL Project

![Java 25](https://img.shields.io/badge/Java-25-blue.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.16-green.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)
![Spring JDBC](https://img.shields.io/badge/Spring-JDBC-red.svg)
![React](https://img.shields.io/badge/React-19-cyan.svg)

---

## 1. Project Overview
The **Smart Campus Integrated Management System** is a full-stack, enterprise-grade university management platform designed to connect students, faculty, and campus administrators into a centralized digital ecosystem.

### Key Functional Capabilities:
- **Role-Based Portals**: Tailored dashboards for **Administrator**, **Faculty**, and **Student**.
- **Campus Resource Management**: Complete tracking of Classrooms, Laboratories, and High-Value Research Equipment.
- **Academic Administration**: Student enrollment, Faculty rosters, Department hierarchy, and Course scheduling.
- **Campus Life**: University events, hackathon registrations with capacity enforcement.
- **Coursework & Grading**: Faculty assignment publishing and student submission evaluation with grading and feedback.
- **Internal Notifications**: Time-sensitive alerts, confirmations, and reminders.
- **SIGNATURE INNOVATION — Campus Resource Rescue Engine**: An intelligent Java-based allocation and recovery engine that rescues abandoned and cancelled reservation slots, maintains a PriorityQueue-based waitlist, provides alternative room recommendations, and automates no-show detection with a 15-minute grace period.

---

## 2. Default Demo Credentials
Pre-seeded credentials in the MySQL database:

| Role | Username / Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartcampus.edu` | `Admin@123` | Full campus management, department/faculty/student CRUD, booking approvals, global analytics |
| **Faculty Member** | `faculty.smith@smartcampus.edu` | `Faculty@123` | Assigned courses, assignment publishing, grading submissions, room & lab reservations |
| **Student** | `student.alex@smartcampus.edu` | `Student@123` | Academic overview, course enrollments, assignment uploads, event registrations, waitlist offers |

---

## 3. Project Directory Structure
```
SMART-CAMPUS/
│
├── backend/                         # Spring Boot 3.x Backend (Java 25, JDBC, Spring Security)
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/smartcampus/
│       │   │   ├── SmartCampusApplication.java
│       │   │   ├── config/          # SecurityConfig, JdbcConfig
│       │   │   ├── controller/      # REST Endpoints (Student, Faculty, Booking, RescueEngine, etc.)
│       │   │   ├── service/         # Business Logic, Rescue Engine, PriorityQueue
│       │   │   ├── repository/      # Spring JdbcTemplate Data Access Repositories
│       │   │   ├── model/           # OOP Entities (Person, Student, Faculty, Classroom, etc.)
│       │   │   ├── dto/             # Data Transfer Objects & Generic ApiResponse<T>
│       │   │   ├── interfaces/      # Bookable, Manageable, Notifiable
│       │   │   ├── exception/       # Custom Exceptions & GlobalExceptionHandler
│       │   │   ├── security/        # BCrypt & Security Filter Chains
│       │   │   └── util/            # StreamFilters, PrioritySlotMatcher, FileUploadUtil
│       │   └── resources/
│       │       └── application.properties
│       └── test/                    # JUnit 5 & Concurrency Tests
│
├── database/
│   └── smart_campus.sql             # Complete MySQL 8 Schema (19 Tables, Constraints, Indexes & Seed Data)
│
├── documentation/
│   ├── system_architecture.md       # High-Level Architecture Blueprint
│   ├── database_design.md           # Relational Schema Specification
│   ├── api_documentation.md         # Full REST API Endpoint Guide
│   ├── oop_implementation.md        # Academic Java OOP Concept Mapping (PBL / Viva)
│   └── testing_report.md            # Test Execution & Concurrency Verification
│
└── src/                             # Interactive University Management Web App
```

---

## 4. Local Execution & Setup Instructions

### Prerequisites
1. **Java 25 (LTS)**: Verify with `java -version`
2. **Apache Maven 3.8+**: Verify with `mvn -version`
3. **MySQL 8.0+**: Ensure the MySQL server service is running on port 3306

### Step-by-Step Setup:
```bash
# 1. Initialize the MySQL database
mysql -u root -p < database/smart_campus.sql

# 2. Configure Database Credentials (if different from root/root)
export DB_URL="jdbc:mysql://localhost:3306/smart_campus?useSSL=false&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="your_password"

# 3. Build & Run the Java Spring Boot Backend
cd backend
mvn clean package -DskipTests
java -jar target/smart-campus-backend-1.0.0.jar

# 4. Open the Application
# The Spring Boot server starts at http://localhost:8080
# The interactive live UI preview runs on port 3000
```
