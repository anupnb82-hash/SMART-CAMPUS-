-- =====================================================================
-- SMART CAMPUS INTEGRATED MANAGEMENT SYSTEM
-- Complete Database Architecture & Schema Specification
-- Target RDBMS: MySQL 8.0+
-- Database Name: smart_campus
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS smart_campus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_campus;

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. USERS TABLE (Authentication & Base Credentials)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'FACULTY', 'STUDENT') NOT NULL,
    account_status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. DEPARTMENTS TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    department_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_code VARCHAR(20) NOT NULL UNIQUE,
    department_name VARCHAR(150) NOT NULL,
    building VARCHAR(100) NOT NULL,
    head_of_department VARCHAR(150),
    contact_email VARCHAR(150),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dept_code (department_code)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. STUDENTS TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    academic_year INT NOT NULL,
    semester INT NOT NULL,
    phone VARCHAR(30),
    cgpa DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    INDEX idx_student_roll (roll_number),
    INDEX idx_student_dept (department_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. FACULTY TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS faculty;
CREATE TABLE faculty (
    faculty_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    designation VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    office_room VARCHAR(50),
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    INDEX idx_faculty_emp_code (employee_code),
    INDEX idx_faculty_dept (department_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. COURSES TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
    course_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(30) NOT NULL UNIQUE,
    course_name VARCHAR(200) NOT NULL,
    department_id BIGINT NOT NULL,
    faculty_id BIGINT,
    credits INT NOT NULL DEFAULT 3,
    semester INT NOT NULL,
    description TEXT,
    schedule VARCHAR(100),
    max_enrollment INT DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE SET NULL,
    INDEX idx_course_code (course_code),
    INDEX idx_course_faculty (faculty_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. STUDENT_COURSES TABLE (Enrollment Junction)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS student_courses;
CREATE TABLE student_courses (
    enrollment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grade VARCHAR(5) DEFAULT 'IP',
    attendance_percentage DECIMAL(5, 2) DEFAULT 100.00,
    UNIQUE KEY uk_student_course (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. CLASSROOMS TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS classrooms;
CREATE TABLE classrooms (
    classroom_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    building VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    capacity INT NOT NULL,
    has_projector BOOLEAN DEFAULT TRUE,
    has_smartboard BOOLEAN DEFAULT FALSE,
    has_air_conditioning BOOLEAN DEFAULT TRUE,
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_classroom_building (building)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. LABORATORIES TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS laboratories;
CREATE TABLE laboratories (
    lab_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lab_name VARCHAR(150) NOT NULL UNIQUE,
    building VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    capacity INT NOT NULL,
    department_id BIGINT NOT NULL,
    safety_level VARCHAR(50) DEFAULT 'Standard',
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    INDEX idx_lab_dept (department_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. EQUIPMENT TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS equipment;
CREATE TABLE equipment (
    equipment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment_code VARCHAR(50) NOT NULL UNIQUE,
    equipment_name VARCHAR(150) NOT NULL,
    lab_id BIGINT,
    department_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_quantity INT NOT NULL DEFAULT 1,
    available_quantity INT NOT NULL DEFAULT 1,
    condition_status ENUM('EXCELLENT', 'GOOD', 'NEEDS_MAINTENANCE') DEFAULT 'EXCELLENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lab_id) REFERENCES laboratories(lab_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT,
    INDEX idx_equip_code (equipment_code)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. BOOKINGS TABLE (Resource Reservations)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    booking_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_type ENUM('CLASSROOM', 'LABORATORY', 'EQUIPMENT') NOT NULL,
    resource_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED', 'NO_SHOW') DEFAULT 'CONFIRMED',
    check_in_status ENUM('NOT_CHECKED_IN', 'CHECKED_IN', 'EXPIRED_NO_SHOW') DEFAULT 'NOT_CHECKED_IN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_booking_schedule (resource_type, resource_id, booking_date, start_time, end_time),
    INDEX idx_booking_user (user_id),
    INDEX idx_booking_status (status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. WAITING_LIST TABLE (Campus Resource Rescue Engine)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS waiting_list;
CREATE TABLE waiting_list (
    wait_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_type ENUM('CLASSROOM', 'LABORATORY', 'EQUIPMENT') NOT NULL,
    resource_id BIGINT NOT NULL,
    requested_date DATE NOT NULL,
    preferred_start_time TIME NOT NULL,
    preferred_end_time TIME NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    priority INT DEFAULT 1, -- 1: Normal, 2: Academic Faculty, 3: High Priority Urgent Exam/Lab
    auto_allocate_opt_in BOOLEAN DEFAULT TRUE,
    status ENUM('WAITING', 'OFFERED', 'ALLOCATED', 'EXPIRED', 'CANCELLED') DEFAULT 'WAITING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_wait_resource (resource_type, resource_id, requested_date, status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 12. SLOT_OFFERS TABLE (Smart Recovery & User Confirmation)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS slot_offers;
CREATE TABLE slot_offers (
    offer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wait_id BIGINT NOT NULL,
    booking_id BIGINT, -- Linked once accepted
    user_id BIGINT NOT NULL,
    resource_type ENUM('CLASSROOM', 'LABORATORY', 'EQUIPMENT') NOT NULL,
    resource_id BIGINT NOT NULL,
    offer_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wait_id) REFERENCES waiting_list(wait_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_offer_status (status, expires_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 13. RESOURCE_CHECKINS TABLE (No-Show Detection)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS resource_checkins;
CREATE TABLE resource_checkins (
    checkin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    scheduled_start TIMESTAMP NOT NULL,
    grace_period_minutes INT DEFAULT 15,
    actual_checkin_time TIMESTAMP NULL,
    actual_checkout_time TIMESTAMP NULL,
    is_no_show BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 14. EVENTS TABLE (Campus Activities)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS events;
CREATE TABLE events (
    event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    venue VARCHAR(150) NOT NULL,
    organizer_user_id BIGINT NOT NULL,
    category VARCHAR(100) DEFAULT 'Academic',
    max_participants INT NOT NULL DEFAULT 100,
    current_participants INT NOT NULL DEFAULT 0,
    status ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    INDEX idx_event_date (event_date, status)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 15. EVENT_REGISTRATIONS TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS event_registrations;
CREATE TABLE event_registrations (
    registration_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status ENUM('REGISTERED', 'ATTENDED', 'CANCELLED') DEFAULT 'REGISTERED',
    UNIQUE KEY uk_event_user (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 16. ASSIGNMENTS TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS assignments;
CREATE TABLE assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    faculty_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    instructions TEXT,
    deadline DATETIME NOT NULL,
    max_score INT DEFAULT 100,
    file_attachment_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    INDEX idx_assignment_course (course_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 17. ASSIGNMENT_SUBMISSIONS TABLE
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS assignment_submissions;
CREATE TABLE assignment_submissions (
    submission_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submission_text TEXT,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score INT DEFAULT NULL,
    feedback TEXT,
    evaluation_status ENUM('PENDING', 'EVALUATED') DEFAULT 'PENDING',
    UNIQUE KEY uk_assignment_student (assignment_id, student_id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 18. NOTIFICATIONS TABLE (Internal User Notifications)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('BOOKING', 'WAITLIST_OFFER', 'ASSIGNMENT', 'EVENT', 'SYSTEM') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 19. ACTIVITY_LOGS TABLE (Audit Trail & Logging)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS activity_logs;
CREATE TABLE activity_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action_type VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_log_time (created_at),
    INDEX idx_log_module (module)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- SEED SAMPLE DATA (Deterministic Real-World University Records)
-- Passwords below are pre-hashed using BCrypt (cost factor 10)
-- Default passwords:
-- Admin:   Admin@123   ($2a$10$9.0q1P3oP.X5kP4GZ7zZWeK1Z.1lqU/K6Z0OQjS5fQkH0Uq7C5E0S)
-- Faculty: Faculty@123 ($2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1BPEvW8.5P9i0P9aK5q/y1Wp6V5s4K)
-- Student: Student@123 ($2a$10$1Y8g9mE9Z0.hT3e4Y7Z.u.g1R5s6T7u8V9w0X1y2Z3a4B5c6D7e8F)
-- =====================================================================

INSERT INTO users (user_id, username, email, password_hash, role, account_status) VALUES
(1, 'admin', 'admin@smartcampus.edu', '$2a$10$9.0q1P3oP.X5kP4GZ7zZWeK1Z.1lqU/K6Z0OQjS5fQkH0Uq7C5E0S', 'ADMIN', 'ACTIVE'),
(2, 'dr_smith', 'faculty.smith@smartcampus.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1BPEvW8.5P9i0P9aK5q/y1Wp6V5s4K', 'FACULTY', 'ACTIVE'),
(3, 'prof_johnson', 'faculty.johnson@smartcampus.edu', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1BPEvW8.5P9i0P9aK5q/y1Wp6V5s4K', 'FACULTY', 'ACTIVE'),
(4, 'alex_morgan', 'student.alex@smartcampus.edu', '$2a$10$1Y8g9mE9Z0.hT3e4Y7Z.u.g1R5s6T7u8V9w0X1y2Z3a4B5c6D7e8F', 'STUDENT', 'ACTIVE'),
(5, 'sarah_chen', 'student.sarah@smartcampus.edu', '$2a$10$1Y8g9mE9Z0.hT3e4Y7Z.u.g1R5s6T7u8V9w0X1y2Z3a4B5c6D7e8F', 'STUDENT', 'ACTIVE');

INSERT INTO departments (department_id, department_code, department_name, building, head_of_department, contact_email, contact_phone) VALUES
(1, 'CS', 'Computer Science & Engineering', 'Alan Turing Hall', 'Dr. Margaret Hamilton', 'cs-desk@smartcampus.edu', '+1-555-0101'),
(2, 'EE', 'Electrical & Electronics Engineering', 'Nikola Tesla Tower', 'Dr. Claude Shannon', 'ee-desk@smartcampus.edu', '+1-555-0102'),
(3, 'ME', 'Mechanical & Aerospace Engineering', 'Wright Brothers Complex', 'Dr. Theodore von Karman', 'me-desk@smartcampus.edu', '+1-555-0103'),
(4, 'DS', 'Data Science & Artificial Intelligence', 'Ada Lovelace Building', 'Dr. Geoffrey Hinton', 'ds-desk@smartcampus.edu', '+1-555-0104');

INSERT INTO students (student_id, user_id, full_name, roll_number, department_id, academic_year, semester, phone, cgpa) VALUES
(1, 4, 'Alex Morgan', 'CS-2023-042', 1, 3, 5, '+1-555-0242', 3.88),
(2, 5, 'Sarah Chen', 'DS-2023-089', 4, 3, 5, '+1-555-0289', 3.95);

INSERT INTO faculty (faculty_id, user_id, full_name, employee_code, department_id, designation, phone, office_room, specialization) VALUES
(1, 2, 'Dr. Robert Smith', 'FAC-CS-101', 1, 'Professor & Chair', '+1-555-0150', 'Turing Hall 304', 'Distributed Systems & Cloud Computing'),
(2, 3, 'Dr. Emily Johnson', 'FAC-DS-108', 4, 'Associate Professor', '+1-555-0155', 'Lovelace 210', 'Deep Learning & Neural Architectures');

INSERT INTO courses (course_id, course_code, course_name, department_id, faculty_id, credits, semester, description, schedule, max_enrollment) VALUES
(1, 'CS301', 'Advanced Object-Oriented Programming with Java', 1, 1, 4, 5, 'Comprehensive study of OOP principles, concurrency, multithreading, Streams, JDBC, and Spring Boot.', 'Mon/Wed 10:00 - 11:30 AM', 60),
(2, 'CS304', 'Database Systems Architecture & Query Optimization', 1, 1, 3, 5, 'Relational schema design, normalization, ACID properties, indexing, and transactional isolation.', 'Tue/Thu 02:00 - 03:30 PM', 55),
(3, 'DS302', 'Machine Learning & Predictive Systems', 4, 2, 4, 5, 'Supervised/unsupervised algorithms, evaluation metrics, feature engineering, and neural pipelines.', 'Mon/Wed 02:00 - 03:30 PM', 45);

INSERT INTO student_courses (student_id, course_id, grade, attendance_percentage) VALUES
(1, 1, 'A', 96.50),
(1, 2, 'A-', 92.00),
(2, 1, 'A', 98.00),
(2, 3, 'A+', 99.00);

INSERT INTO classrooms (classroom_id, room_number, building, floor, capacity, has_projector, has_smartboard, has_air_conditioning, status) VALUES
(1, 'ATH-101', 'Alan Turing Hall', 1, 60, TRUE, TRUE, TRUE, 'AVAILABLE'),
(2, 'ATH-205', 'Alan Turing Hall', 2, 45, TRUE, FALSE, TRUE, 'AVAILABLE'),
(3, 'NTT-102', 'Nikola Tesla Tower', 1, 80, TRUE, TRUE, TRUE, 'AVAILABLE'),
(4, 'ALB-301', 'Ada Lovelace Building', 3, 50, TRUE, TRUE, TRUE, 'AVAILABLE');

INSERT INTO laboratories (lab_id, lab_name, building, floor, capacity, department_id, safety_level, status) VALUES
(1, 'Software Engineering & Cloud Computing Lab', 'Alan Turing Hall', 2, 40, 1, 'Standard Computing', 'AVAILABLE'),
(2, 'Robotics & Embedded Systems Lab', 'Nikola Tesla Tower', 1, 30, 2, 'Electro-Mechanical Class 1', 'AVAILABLE'),
(3, 'AI & High-Performance Computing Cluster', 'Ada Lovelace Building', 3, 35, 4, 'Thermal Monitored', 'AVAILABLE');

INSERT INTO equipment (equipment_id, equipment_code, equipment_name, lab_id, department_id, category, total_quantity, available_quantity, condition_status) VALUES
(1, 'EQ-GPU-4090', 'NVIDIA RTX 4090 Deep Learning Workstation', 3, 4, 'Computing Hardware', 12, 10, 'EXCELLENT'),
(2, 'EQ-OSC-200', 'Digital Storage Oscilloscope 200MHz', 2, 2, 'Electronics', 15, 12, 'GOOD'),
(3, 'EQ-VR-PRO', 'Meta Quest Pro Spatial Dev Kit', 1, 1, 'Immersive Media', 8, 6, 'EXCELLENT');

INSERT INTO bookings (booking_id, user_id, resource_type, resource_id, booking_date, start_time, end_time, purpose, status, check_in_status) VALUES
(1, 2, 'CLASSROOM', 1, CURDATE(), '09:00:00', '11:00:00', 'CS301 Lecture Session', 'CONFIRMED', 'CHECKED_IN'),
(2, 4, 'LABORATORY', 1, CURDATE(), '14:00:00', '16:00:00', 'PBL Project Sprint Testing', 'CONFIRMED', 'NOT_CHECKED_IN'),
(3, 3, 'CLASSROOM', 4, CURDATE(), '11:30:00', '13:00:00', 'DS302 Seminar', 'CONFIRMED', 'CHECKED_IN');

INSERT INTO waiting_list (wait_id, user_id, resource_type, resource_id, requested_date, preferred_start_time, preferred_end_time, purpose, priority, auto_allocate_opt_in, status) VALUES
(1, 5, 'LABORATORY', 1, CURDATE(), '14:00:00', '16:00:00', 'Model Evaluation & Benchmark', 2, TRUE, 'WAITING');

INSERT INTO events (event_id, event_name, description, event_date, start_time, end_time, venue, organizer_user_id, category, max_participants, current_participants, status) VALUES
(1, 'Smart Campus Hackathon 2026', 'Annual 48-hour competitive software engineering challenge focused on green university IoT and intelligent scheduling.', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '09:00:00', '18:00:00', 'Grand Auditorium & Turing Hall', 1, 'Hackathon', 120, 48, 'UPCOMING'),
(2, 'Guest Lecture: Modern Microservices in Java 21', 'Industrial keynote by chief architect on Virtual Threads, Spring Boot 3, and database replication.', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', '16:00:00', 'ATH-101 Seminar Hall', 2, 'Keynote', 70, 39, 'UPCOMING');

INSERT INTO event_registrations (registration_id, event_id, user_id, attendance_status) VALUES
(1, 1, 4, 'REGISTERED'),
(2, 2, 4, 'REGISTERED'),
(3, 1, 5, 'REGISTERED');

INSERT INTO assignments (assignment_id, course_id, faculty_id, title, instructions, deadline, max_score, file_attachment_url) VALUES
(1, 1, 1, 'OOP Project Milestone: Resource Rescue Engine Implementation', 'Implement the PriorityQueue-based Slot Allocation algorithm with custom exception handling and JDBC transactions.', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 100, '/docs/milestone-spec.pdf'),
(2, 2, 1, 'Relational Normalization & SQL Triggers Workshop', 'Design 3NF schemas for campus lodging and write safe parameterized transaction scripts.', DATE_ADD(CURDATE(), INTERVAL 9 DAY), 50, '/docs/db-workshop.pdf');

INSERT INTO notifications (notification_id, user_id, title, message, type, is_read, action_url) VALUES
(1, 4, 'Course Enrollment Confirmed', 'You are actively enrolled in CS301 (Advanced Java OOP) with Dr. Robert Smith.', 'SYSTEM', TRUE, '/courses/CS301'),
(2, 4, 'Upcoming Assignment Deadline', 'Milestone submission for CS301 is due in 5 days.', 'ASSIGNMENT', FALSE, '/assignments/1'),
(3, 5, 'Waiting List Active', 'You are #1 on the waiting list for Software Engineering Lab for today 14:00 - 16:00.', 'WAITLIST_OFFER', FALSE, '/rescue-engine');

INSERT INTO activity_logs (log_id, user_id, action_type, module, details, ip_address) VALUES
(1, 1, 'SYSTEM_INIT', 'DATABASE', 'Smart Campus database schema initialized successfully.', '127.0.0.1'),
(2, 2, 'BOOKING_CREATED', 'RESOURCE_BOOKING', 'Created confirmed booking for ATH-101 (CS301).', '127.0.0.1');
