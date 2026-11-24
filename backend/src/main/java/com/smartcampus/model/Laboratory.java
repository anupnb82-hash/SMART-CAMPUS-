package com.smartcampus.model;

import com.smartcampus.interfaces.Bookable;
import com.smartcampus.interfaces.Manageable;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Laboratory entity implementing Bookable and Manageable.
 */
public class Laboratory implements Bookable, Manageable {
    private Long labId;
    private String labName;
    private String building;
    private int floor;
    private int capacity;
    private Long departmentId;
    private String departmentName;
    private String safetyLevel;
    private String status;

    public Laboratory() {
        this.status = "AVAILABLE";
        this.safetyLevel = "Standard Computing";
    }

    public Laboratory(Long labId, String labName, String building, int floor, int capacity, Long departmentId) {
        this();
        this.labId = labId;
        this.labName = labName;
        this.building = building;
        this.floor = floor;
        this.capacity = capacity;
        this.departmentId = departmentId;
    }

    @Override
    public Long getResourceId() { return labId; }

    @Override
    public String getResourceName() { return labName; }

    @Override
    public String getResourceType() { return "LABORATORY"; }

    @Override
    public boolean isAvailable(LocalDate date, LocalTime startTime, LocalTime endTime) {
        return "AVAILABLE".equalsIgnoreCase(status);
    }

    @Override
    public int getCapacity() { return capacity; }

    @Override
    public String getBuildingLocation() { return building + " (Floor " + floor + ")"; }

    @Override
    public String getIdentifier() { return "LAB-" + labId + ": " + labName; }

    @Override
    public String getStatus() { return status; }

    @Override
    public void setStatus(String status) { this.status = status; }

    @Override
    public boolean isActive() { return !"MAINTENANCE".equalsIgnoreCase(status); }

    // Getters and Setters
    public Long getLabId() { return labId; }
    public void setLabId(Long labId) { this.labId = labId; }

    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public int getFloor() { return floor; }
    public void setFloor(int floor) { this.floor = floor; }

    public void setCapacity(int capacity) { this.capacity = capacity; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getSafetyLevel() { return safetyLevel; }
    public void setSafetyLevel(String safetyLevel) { this.safetyLevel = safetyLevel; }
}
