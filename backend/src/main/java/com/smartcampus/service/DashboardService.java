package com.smartcampus.service;

import com.smartcampus.dto.DashboardStatsResponse;
import com.smartcampus.model.ActivityLog;
import com.smartcampus.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final ResourceRepository resourceRepository;
    private final BookingRepository bookingRepository;
    private final SlotOfferRepository slotOfferRepository;
    private final WaitingListRepository waitingListRepository;
    private final EventRepository eventRepository;
    private final ActivityLogRepository activityLogRepository;
    private final CampusResourceRescueEngineService rescueEngineService;

    public DashboardService(StudentRepository studentRepository,
                            FacultyRepository facultyRepository,
                            DepartmentRepository departmentRepository,
                            CourseRepository courseRepository,
                            ResourceRepository resourceRepository,
                            BookingRepository bookingRepository,
                            SlotOfferRepository slotOfferRepository,
                            WaitingListRepository waitingListRepository,
                            EventRepository eventRepository,
                            ActivityLogRepository activityLogRepository,
                            CampusResourceRescueEngineService rescueEngineService) {
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.resourceRepository = resourceRepository;
        this.bookingRepository = bookingRepository;
        this.slotOfferRepository = slotOfferRepository;
        this.waitingListRepository = waitingListRepository;
        this.eventRepository = eventRepository;
        this.activityLogRepository = activityLogRepository;
        this.rescueEngineService = rescueEngineService;
    }

    public DashboardStatsResponse getAdminDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalStudents(studentRepository.count());
        stats.setTotalFaculty(facultyRepository.count());
        stats.setTotalDepartments(departmentRepository.count());
        stats.setTotalCourses(courseRepository.count());
        stats.setTotalClassrooms(resourceRepository.countClassrooms());
        stats.setTotalLaboratories(resourceRepository.countLaboratories());
        stats.setTotalEquipment(resourceRepository.countEquipment());
        stats.setUpcomingEvents(eventRepository.countUpcoming());
        stats.setPendingBookings(bookingRepository.countPending());
        stats.setConfirmedBookings(bookingRepository.countConfirmed());
        stats.setRecoveredSlots(slotOfferRepository.countRecovered());
        stats.setWaitingListCount(waitingListRepository.countActive());
        stats.setNoShowCount(bookingRepository.countNoShows());

        Map<String, Object> rescueAnalytics = rescueEngineService.calculateUtilizationAnalytics();
        stats.setResourceUtilizationRate((Double) rescueAnalytics.getOrDefault("utilizationRate", 91.5));

        return stats;
    }

    public List<ActivityLog> getRecentActivities(int limit) {
        return activityLogRepository.findRecent(limit);
    }
}
