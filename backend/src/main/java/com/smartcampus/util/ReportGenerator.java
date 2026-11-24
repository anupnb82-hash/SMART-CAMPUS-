package com.smartcampus.util;

import com.smartcampus.model.Booking;
import com.smartcampus.model.Student;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Report Export Utility demonstrating Java I/O streams and CSV generation.
 */
public class ReportGenerator {

    public static byte[] generateStudentRosterCsv(List<Student> students) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(baos, true, StandardCharsets.UTF_8)) {
            writer.println("Student ID,Roll Number,Full Name,Email,Phone,Department ID,Year,Semester,CGPA,Status");
            for (Student s : students) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",%d,%d,%d,%.2f,\"%s\"%n",
                        s.getId(),
                        s.getRollNumber(),
                        s.getFullName(),
                        s.getEmail(),
                        s.getPhone() != null ? s.getPhone() : "",
                        s.getDepartmentId(),
                        s.getAcademicYear(),
                        s.getSemester(),
                        s.getCgpa() != null ? s.getCgpa().doubleValue() : 0.0,
                        s.getAccountStatus()
                );
            }
        }
        return baos.toByteArray();
    }

    public static byte[] generateBookingAuditCsv(List<Booking> bookings) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(baos, true, StandardCharsets.UTF_8)) {
            writer.println("Booking ID,User ID,Resource Type,Resource ID,Booking Date,Start Time,End Time,Purpose,Status,Check-In");
            for (Booking b : bookings) {
                writer.printf("%d,%d,\"%s\",%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        b.getBookingId(),
                        b.getUserId(),
                        b.getResourceType(),
                        b.getResourceId(),
                        b.getBookingDate(),
                        b.getStartTime(),
                        b.getEndTime(),
                        b.getPurpose().replace("\"", "\"\""),
                        b.getStatus(),
                        b.getCheckInStatus()
                );
            }
        }
        return baos.toByteArray();
    }
}
