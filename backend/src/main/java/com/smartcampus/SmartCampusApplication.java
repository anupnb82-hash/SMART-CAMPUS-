package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Smart Campus Integrated Management System - Entry Point
 * 
 * Demonstrates:
 * - Layered enterprise architecture
 * - Pure Spring JDBC data access (No JPA/Hibernate)
 * - Object-Oriented Design (Inheritance, Polymorphism, Encapsulation, Abstraction)
 * - Concurrency control & PriorityQueue based Resource Rescue Engine
 */
@SpringBootApplication
@EnableScheduling
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
        System.out.println("=========================================================");
        System.out.println("  SMART CAMPUS INTEGRATED MANAGEMENT SYSTEM STARTED");
        System.out.println("  Server Port: 8080");
        System.out.println("  Database: MySQL (smart_campus via JdbcTemplate)");
        System.out.println("  Rescue Engine: Active (Priority-based Slot Recovery)");
        System.out.println("=========================================================");
    }
}
