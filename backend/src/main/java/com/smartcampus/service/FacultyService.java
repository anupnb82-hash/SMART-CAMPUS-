package com.smartcampus.service;

import com.smartcampus.exception.FacultyNotFoundException;
import com.smartcampus.model.Faculty;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.FacultyRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public FacultyService(FacultyRepository facultyRepository, 
                          UserRepository userRepository, 
                          ActivityLogRepository activityLogRepository,
                          PasswordEncoder passwordEncoder) {
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new FacultyNotFoundException(id));
    }

    public Faculty getFacultyByUserId(Long userId) {
        return facultyRepository.findByUserId(userId)
                .orElseThrow(() -> new FacultyNotFoundException("Faculty profile not found for user ID: " + userId));
    }

    public List<Faculty> searchFaculty(String query, Long departmentId) {
        return facultyRepository.findAll().stream()
                .filter(f -> query == null || query.isBlank() ||
                        f.getFullName().toLowerCase().contains(query.toLowerCase()) ||
                        f.getEmployeeCode().toLowerCase().contains(query.toLowerCase()) ||
                        f.getSpecialization().toLowerCase().contains(query.toLowerCase()))
                .filter(f -> departmentId == null || f.getDepartmentId().equals(departmentId))
                .collect(Collectors.toList());
    }

    @Transactional
    public Faculty createFaculty(Faculty faculty, String initialPassword) {
        String passwordHash = passwordEncoder.encode(initialPassword != null ? initialPassword : "Faculty@123");
        String username = faculty.getEmployeeCode().toLowerCase().replace("-", "_");
        Long userId = userRepository.createUser(username, faculty.getEmail(), passwordHash, "FACULTY");

        faculty.setUserId(userId);
        Long facultyId = facultyRepository.save(faculty);
        faculty.setId(facultyId);

        activityLogRepository.log(userId, "FACULTY_REGISTERED", "FACULTY", 
                "Registered faculty member: " + faculty.getFullName() + " (" + faculty.getDesignation() + ")");
        return faculty;
    }

    @Transactional
    public Faculty updateFaculty(Long id, Faculty update) {
        Faculty existing = getFacultyById(id);
        existing.setFullName(update.getFullName());
        existing.setEmployeeCode(update.getEmployeeCode());
        existing.setDepartmentId(update.getDepartmentId());
        existing.setDesignation(update.getDesignation());
        existing.setPhone(update.getPhone());
        existing.setOfficeRoom(update.getOfficeRoom());
        existing.setSpecialization(update.getSpecialization());

        facultyRepository.update(existing);
        activityLogRepository.log(existing.getUserId(), "FACULTY_UPDATED", "FACULTY", "Updated faculty profile ID: " + id);
        return existing;
    }

    @Transactional
    public void deleteFaculty(Long id) {
        Faculty faculty = getFacultyById(id);
        facultyRepository.deleteById(id);
        userRepository.updateStatus(faculty.getUserId(), "INACTIVE");
        activityLogRepository.log(faculty.getUserId(), "FACULTY_DEACTIVATED", "FACULTY", "Deactivated faculty ID: " + id);
    }
}
