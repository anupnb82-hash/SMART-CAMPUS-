package com.smartcampus.model;

import com.smartcampus.interfaces.Bookable;
import com.smartcampus.interfaces.Manageable;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Classroom entity implementing Bookable and Manageable.
 */
public class Classroom implements Bookable, Manageable {
    private Long classroomId;
    private String roomNumber;
    private String building;
    private int floor;
    private int capacity;
    private boolean hasProjector;
    private boolean hasSmartboard;
    private boolean hasAirConditioning;
    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE

    public Classroom() {
        this.status = "AVAILABLE";
        this.hasProjector = true;
        this.hasAirConditioning = true;
    }

    public Classroom(Long classroomId, String roomNumber, String building, int floor, int capacity) {
        this();
        this.classroomId = classroomId;
        this.roomNumber = roomNumber;
        this.building = building;
        this.floor = floor;
        this.capacity = capacity;
    }

    // Bookable Implementation
    @Override
    public Long getResourceId() { return classroomId; }

    @Override
    public String getResourceName() { return roomNumber + " (" + building + ")"; }

    @Override
    public String getResourceType() { return "CLASSROOM"; }

    @Override
    public boolean isAvailable(LocalDate date, LocalTime startTime, LocalTime endTime) {
        return "AVAILABLE".equalsIgnoreCase(status);
    }

    @Override
    public int getCapacity() { return capacity; }

    @Override
    public String getBuildingLocation() { return building + ", Floor " + floor; }

    // Manageable Implementation
    @Override
    public String getIdentifier() { return roomNumber; }

    @Override
    public String getStatus() { return status; }

    @Override
    public void setStatus(String status) { this.status = status; }

    @Override
    public boolean isActive() { return !"MAINTENANCE".equalsIgnoreCase(status); }

    // Getters and Setters
    public Long getClassroomId() { return classroomId; }
    public void setClassroomId(Long classroomId) { this.classroomId = classroomId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public int getFloor() { return floor; }
    public void setFloor(int floor) { this.floor = floor; }

    public void setCapacity(int capacity) { this.capacity = capacity; }

    public boolean isHasProjector() { return hasProjector; }
    public void setHasProjector(boolean hasProjector) { this.hasProjector = hasProjector; }

    public boolean isHasSmartboard() { return hasSmartboard; }
    public void setHasSmartboard(boolean hasSmartboard) { this.hasSmartboard = hasSmartboard; }

    public boolean isHasAirConditioning() { return hasAirConditioning; }
    public void setHasAirConditioning(boolean hasAirConditioning) { this.hasAirConditioning = hasAirConditioning; }
}
