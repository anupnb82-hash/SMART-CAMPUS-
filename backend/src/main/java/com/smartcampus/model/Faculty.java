package com.smartcampus.model;

/**
 * Concrete Class: Faculty
 * Demonstrates:
 * - Inheritance: Extends abstract Person
 * - Polymorphism: Overrides getRoleDescription()
 */
public class Faculty extends Person {
    private String employeeCode;
    private String designation;
    private String officeRoom;
    private String specialization;

    public Faculty() {
        super();
    }

    public Faculty(Long id, Long userId, String fullName, String email, String phone,
                   Long departmentId, String employeeCode, String designation, 
                   String officeRoom, String specialization) {
        super(id, userId, fullName, email, phone, departmentId);
        this.employeeCode = employeeCode;
        this.designation = designation;
        this.officeRoom = officeRoom;
        this.specialization = specialization;
    }

    @Override
    public String getRoleDescription() {
        return "Faculty Member: " + designation + " (" + specialization + ")";
    }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getOfficeRoom() { return officeRoom; }
    public void setOfficeRoom(String officeRoom) { this.officeRoom = officeRoom; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
