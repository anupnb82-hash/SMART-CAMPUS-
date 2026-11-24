package com.smartcampus.dto;

public class DashboardStatsResponse {
    private long totalStudents;
    private long totalFaculty;
    private long totalDepartments;
    private long totalCourses;
    private long totalClassrooms;
    private long totalLaboratories;
    private long totalEquipment;
    private long upcomingEvents;
    private long pendingBookings;
    private long confirmedBookings;
    private long recoveredSlots;
    private long waitingListCount;
    private double resourceUtilizationRate;
    private long noShowCount;

    public DashboardStatsResponse() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalFaculty() { return totalFaculty; }
    public void setTotalFaculty(long totalFaculty) { this.totalFaculty = totalFaculty; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getTotalClassrooms() { return totalClassrooms; }
    public void setTotalClassrooms(long totalClassrooms) { this.totalClassrooms = totalClassrooms; }

    public long getTotalLaboratories() { return totalLaboratories; }
    public void setTotalLaboratories(long totalLaboratories) { this.totalLaboratories = totalLaboratories; }

    public long getTotalEquipment() { return totalEquipment; }
    public void setTotalEquipment(long totalEquipment) { this.totalEquipment = totalEquipment; }

    public long getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(long upcomingEvents) { this.upcomingEvents = upcomingEvents; }

    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }

    public long getConfirmedBookings() { return confirmedBookings; }
    public void setConfirmedBookings(long confirmedBookings) { this.confirmedBookings = confirmedBookings; }

    public long getRecoveredSlots() { return recoveredSlots; }
    public void setRecoveredSlots(long recoveredSlots) { this.recoveredSlots = recoveredSlots; }

    public long getWaitingListCount() { return waitingListCount; }
    public void setWaitingListCount(long waitingListCount) { this.waitingListCount = waitingListCount; }

    public double getResourceUtilizationRate() { return resourceUtilizationRate; }
    public void setResourceUtilizationRate(double resourceUtilizationRate) { this.resourceUtilizationRate = resourceUtilizationRate; }

    public long getNoShowCount() { return noShowCount; }
    public void setNoShowCount(long noShowCount) { this.noShowCount = noShowCount; }
}
