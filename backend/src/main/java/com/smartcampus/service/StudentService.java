package com.smartcampus.service;

import com.smartcampus.exception.StudentNotFoundException;
import com.smartcampus.model.Student;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.util.ReportGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, 
                          UserRepository userRepository, 
                          ActivityLogRepository activityLogRepository,
                          PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new StudentNotFoundException("Student profile not found for user ID: " + userId));
    }

    public List<Student> searchStudents(String query, Long departmentId, Integer year) {
        return studentRepository.findAll().stream()
                .filter(s -> query == null || query.isBlank() ||
                        s.getFullName().toLowerCase().contains(query.toLowerCase()) ||
                        s.getRollNumber().toLowerCase().contains(query.toLowerCase()) ||
                        s.getEmail().toLowerCase().contains(query.toLowerCase()))
                .filter(s -> departmentId == null || s.getDepartmentId().equals(departmentId))
                .filter(s -> year == null || s.getAcademicYear() == year)
                .collect(Collectors.toList());
    }

    @Transactional
    public Student createStudent(Student student, String initialPassword) {
        // Create base user credential
        String passwordHash = passwordEncoder.encode(initialPassword != null ? initialPassword : "Student@123");
        String username = student.getRollNumber().toLowerCase().replace("-", "_");
        Long userId = userRepository.createUser(username, student.getEmail(), passwordHash, "STUDENT");

        student.setUserId(userId);
        Long studentId = studentRepository.save(student);
        student.setId(studentId);

        activityLogRepository.log(userId, "STUDENT_REGISTERED", "STUDENT", 
                "Registered new student " + student.getFullName() + " (" + student.getRollNumber() + ")");
        return student;
    }

    @Transactional
    public Student updateStudent(Long id, Student studentUpdate) {
        Student existing = getStudentById(id);
        existing.setFullName(studentUpdate.getFullName());
        existing.setRollNumber(studentUpdate.getRollNumber());
        existing.setDepartmentId(studentUpdate.getDepartmentId());
        existing.setAcademicYear(studentUpdate.getAcademicYear());
        existing.setSemester(studentUpdate.getSemester());
        existing.setPhone(studentUpdate.getPhone());
        if (studentUpdate.getCgpa() != null) {
            existing.setCgpa(studentUpdate.getCgpa());
        }

        studentRepository.update(existing);
        activityLogRepository.log(existing.getUserId(), "STUDENT_UPDATED", "STUDENT", 
                "Updated details for student ID: " + id);
        return existing;
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.deleteById(id);
        userRepository.updateStatus(student.getUserId(), "INACTIVE");
        activityLogRepository.log(student.getUserId(), "STUDENT_DEACTIVATED", "STUDENT", 
                "Deactivated student ID: " + id);
    }

    public byte[] exportStudentRoster() {
        return ReportGenerator.generateStudentRosterCsv(getAllStudents());
    }
}
