package com.smartcampus.model;

import java.math.BigDecimal;

/**
 * Concrete Class: Student
 * Demonstrates:
 * - Inheritance: Extends abstract Person
 * - Polymorphism: Overrides getRoleDescription()
 * - Method Overloading: computeStatus()
 */
public class Student extends Person {
    private String rollNumber;
    private int academicYear;
    private int semester;
    private BigDecimal cgpa;

    public Student() {
        super();
        this.cgpa = BigDecimal.ZERO;
    }

    public Student(Long id, Long userId, String fullName, String email, String phone, 
                   Long departmentId, String rollNumber, int academicYear, int semester, BigDecimal cgpa) {
        super(id, userId, fullName, email, phone, departmentId);
        this.rollNumber = rollNumber;
        this.academicYear = academicYear;
        this.semester = semester;
        this.cgpa = cgpa;
    }

    @Override
    public String getRoleDescription() {
        return "Undergraduate Student (Year " + academicYear + ", Sem " + semester + ")";
    }

    // Overloaded academic standing calculation
    public String getAcademicStanding() {
        return getAcademicStanding(this.cgpa);
    }

    public String getAcademicStanding(BigDecimal customCgpa) {
        if (customCgpa == null) return "Pending";
        double val = customCgpa.doubleValue();
        if (val >= 3.8) return "Summa Cum Laude / Dean's List";
        if (val >= 3.5) return "Magna Cum Laude";
        if (val >= 3.0) return "Good Standing";
        return "Academic Warning";
    }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public int getAcademicYear() { return academicYear; }
    public void setAcademicYear(int academicYear) { this.academicYear = academicYear; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public BigDecimal getCgpa() { return cgpa; }
    public void setCgpa(BigDecimal cgpa) { this.cgpa = cgpa; }
}
