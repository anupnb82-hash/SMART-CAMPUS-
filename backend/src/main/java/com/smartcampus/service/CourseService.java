package com.smartcampus.service;

import com.smartcampus.exception.CourseNotFoundException;
import com.smartcampus.model.Course;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final ActivityLogRepository activityLogRepository;

    public CourseService(CourseRepository courseRepository, ActivityLogRepository activityLogRepository) {
        this.courseRepository = courseRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new CourseNotFoundException(id));
    }

    public List<Course> getCoursesByFacultyId(Long facultyId) {
        return courseRepository.findByFacultyId(facultyId);
    }

    public List<Course> getCoursesForStudent(Long studentId) {
        return courseRepository.findEnrolledCoursesByStudentId(studentId);
    }

    public List<Course> searchCourses(String query, Long departmentId, Integer semester) {
        return courseRepository.findAll().stream()
                .filter(c -> query == null || query.isBlank() ||
                        c.getCourseCode().toLowerCase().contains(query.toLowerCase()) ||
                        c.getCourseName().toLowerCase().contains(query.toLowerCase()))
                .filter(c -> departmentId == null || c.getDepartmentId().equals(departmentId))
                .filter(c -> semester == null || c.getSemester() == semester)
                .collect(Collectors.toList());
    }

    @Transactional
    public Course createCourse(Course course) {
        Long id = courseRepository.save(course);
        course.setCourseId(id);
        activityLogRepository.log(1L, "COURSE_CREATED", "ACADEMIC", 
                "Created course: " + course.getCourseName() + " (" + course.getCourseCode() + ")");
        return course;
    }

    @Transactional
    public Course updateCourse(Long id, Course update) {
        Course existing = getCourseById(id);
        existing.setCourseCode(update.getCourseCode());
        existing.setCourseName(update.getCourseName());
        existing.setDepartmentId(update.getDepartmentId());
        existing.setFacultyId(update.getFacultyId());
        existing.setCredits(update.getCredits());
        existing.setSemester(update.getSemester());
        existing.setDescription(update.getDescription());
        existing.setSchedule(update.getSchedule());
        existing.setMaxEnrollment(update.getMaxEnrollment());

        courseRepository.update(existing);
        activityLogRepository.log(1L, "COURSE_UPDATED", "ACADEMIC", "Updated course ID: " + id);
        return existing;
    }

    @Transactional
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
        activityLogRepository.log(1L, "COURSE_DELETED", "ACADEMIC", "Deleted course ID: " + id);
    }
}
