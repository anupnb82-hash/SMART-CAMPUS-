package com.smartcampus.model;

import com.smartcampus.interfaces.Bookable;
import com.smartcampus.interfaces.Manageable;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Equipment entity implementing Bookable and Manageable.
 */
public class Equipment implements Bookable, Manageable {
    private Long equipmentId;
    private String equipmentCode;
    private String equipmentName;
    private Long labId;
    private String labName;
    private Long departmentId;
    private String category;
    private int totalQuantity;
    private int availableQuantity;
    private String conditionStatus; // EXCELLENT, GOOD, NEEDS_MAINTENANCE

    public Equipment() {
        this.totalQuantity = 1;
        this.availableQuantity = 1;
        this.conditionStatus = "EXCELLENT";
    }

    public Equipment(Long equipmentId, String equipmentCode, String equipmentName, 
                     Long labId, Long departmentId, String category, int totalQuantity) {
        this();
        this.equipmentId = equipmentId;
        this.equipmentCode = equipmentCode;
        this.equipmentName = equipmentName;
        this.labId = labId;
        this.departmentId = departmentId;
        this.category = category;
        this.totalQuantity = totalQuantity;
        this.availableQuantity = totalQuantity;
    }

    @Override
    public Long getResourceId() { return equipmentId; }

    @Override
    public String getResourceName() { return equipmentName + " [" + equipmentCode + "]"; }

    @Override
    public String getResourceType() { return "EQUIPMENT"; }

    @Override
    public boolean isAvailable(LocalDate date, LocalTime startTime, LocalTime endTime) {
        return availableQuantity > 0 && !"NEEDS_MAINTENANCE".equalsIgnoreCase(conditionStatus);
    }

    @Override
    public int getCapacity() { return availableQuantity; }

    @Override
    public String getBuildingLocation() { return labName != null ? labName : "Central Depository"; }

    @Override
    public String getIdentifier() { return equipmentCode; }

    @Override
    public String getStatus() { return conditionStatus; }

    @Override
    public void setStatus(String status) { this.conditionStatus = status; }

    @Override
    public boolean isActive() { return availableQuantity > 0; }

    // Getters and Setters
    public Long getEquipmentId() { return equipmentId; }
    public void setEquipmentId(Long equipmentId) { this.equipmentId = equipmentId; }

    public String getEquipmentCode() { return equipmentCode; }
    public void setEquipmentCode(String equipmentCode) { this.equipmentCode = equipmentCode; }

    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }

    public Long getLabId() { return labId; }
    public void setLabId(Long labId) { this.labId = labId; }

    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(int totalQuantity) { this.totalQuantity = totalQuantity; }

    public int getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(int availableQuantity) { this.availableQuantity = availableQuantity; }

    public String getConditionStatus() { return conditionStatus; }
    public void setConditionStatus(String conditionStatus) { this.conditionStatus = conditionStatus; }
}
