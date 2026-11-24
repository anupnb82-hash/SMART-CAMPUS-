package com.smartcampus.service;

import com.smartcampus.dto.AuthResponse;
import com.smartcampus.dto.LoginRequest;
import com.smartcampus.model.Faculty;
import com.smartcampus.model.Student;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.FacultyRepository;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogRepository activityLogRepository;

    public AuthService(UserRepository userRepository,
                       StudentRepository studentRepository,
                       FacultyRepository facultyRepository,
                       PasswordEncoder passwordEncoder,
                       ActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityLogRepository = activityLogRepository;
    }

    public AuthResponse login(LoginRequest request) {
        Map<String, Object> user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid university credentials."));

        String storedHash = (String) user.get("passwordHash");
        boolean passwordMatch = passwordEncoder.matches(request.getPassword(), storedHash);

        // Fallback check for initial dev plain-text if not yet hashed
        if (!passwordMatch && request.getPassword().equals(storedHash)) {
            passwordMatch = true;
        }

        if (!passwordMatch) {
            throw new BadCredentialsException("Invalid university credentials.");
        }

        String status = (String) user.get("accountStatus");
        if (!"ACTIVE".equalsIgnoreCase(status)) {
            throw new IllegalStateException("Your account is currently " + status + ". Please contact administration.");
        }

        Long userId = (Long) user.get("userId");
        String username = (String) user.get("username");
        String email = (String) user.get("email");
        String role = (String) user.get("role");

        // Simulated secure session token
        String token = "sc-auth-" + UUID.randomUUID().toString();

        AuthResponse response = new AuthResponse(userId, username, email, role, token);

        // Attach profile details if student or faculty
        if ("STUDENT".equalsIgnoreCase(role)) {
            Optional<Student> student = studentRepository.findByUserId(userId);
            student.ifPresent(response::setProfileDetails);
        } else if ("FACULTY".equalsIgnoreCase(role)) {
            Optional<Faculty> faculty = facultyRepository.findByUserId(userId);
            faculty.ifPresent(response::setProfileDetails);
        }

        activityLogRepository.log(userId, "USER_LOGIN", "AUTHENTICATION", "User logged in with role: " + role);
        return response;
    }
}
