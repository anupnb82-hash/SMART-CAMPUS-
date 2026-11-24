package com.smartcampus.interfaces;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Interface representing any campus facility or physical resource that can be booked.
 * Demonstrates: OOP Interface Abstraction and Polymorphic Resource Reservation.
 */
public interface Bookable {
    Long getResourceId();
    String getResourceName();
    String getResourceType();
    boolean isAvailable(LocalDate date, LocalTime startTime, LocalTime endTime);
    int getCapacity();
    String getBuildingLocation();
}
