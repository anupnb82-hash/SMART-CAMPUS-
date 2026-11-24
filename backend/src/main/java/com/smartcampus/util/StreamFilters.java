package com.smartcampus.util;

import com.smartcampus.model.Classroom;
import com.smartcampus.model.Course;
import com.smartcampus.model.Student;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Functional Utilities utilizing Java Stream API and Lambda Expressions.
 * 
 * Demonstrates:
 * - Stream filtering, mapping, sorting, and grouping
 * - Lambda expressions: (s -> s.getDepartmentId().equals(deptId))
 * - Method references: Student::getFullName, Course::getCredits
 */
public class StreamFilters {

    /**
     * Filters students by department and minimum CGPA threshold using Streams.
     */
    public static List<Student> filterHonorStudents(List<Student> students, Long departmentId, double minCgpa) {
        return students.stream()
                .filter(s -> departmentId == null || s.getDepartmentId().equals(departmentId))
                .filter(s -> s.getCgpa() != null && s.getCgpa().doubleValue() >= minCgpa)
                .sorted((s1, s2) -> s2.getCgpa().compareTo(s1.getCgpa()))
                .collect(Collectors.toList());
    }

    /**
     * Groups courses by semester and calculates total credits per semester.
     */
    public static Map<Integer, Integer> calculateCreditsPerSemester(List<Course> courses) {
        return courses.stream()
                .collect(Collectors.groupingBy(
                        Course::getSemester,
                        Collectors.summingInt(Course::getCredits)
                ));
    }

    /**
     * Recommends alternative classrooms matching or exceeding minimum capacity and facility criteria.
     */
    public static List<Classroom> findAlternativeClassrooms(
            List<Classroom> allRooms, 
            Long excludeRoomId, 
            int minCapacity, 
            boolean requireProjector) {
        
        return allRooms.stream()
                .filter(r -> !r.getClassroomId().equals(excludeRoomId))
                .filter(Classroom::isActive)
                .filter(r -> r.getCapacity() >= minCapacity)
                .filter(r -> !requireProjector || r.isHasProjector())
                .sorted((r1, r2) -> Integer.compare(r1.getCapacity(), r2.getCapacity())) // Closest capacity first
                .limit(5)
                .collect(Collectors.toList());
    }
}
