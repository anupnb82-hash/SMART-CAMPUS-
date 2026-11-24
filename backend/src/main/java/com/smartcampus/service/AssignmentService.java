package com.smartcampus.service;

import com.smartcampus.model.Assignment;
import com.smartcampus.model.AssignmentSubmission;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.AssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final NotificationService notificationService;
    private final ActivityLogRepository activityLogRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             NotificationService notificationService,
                             ActivityLogRepository activityLogRepository) {
        this.assignmentRepository = assignmentRepository;
        this.notificationService = notificationService;
        this.activityLogRepository = activityLogRepository;
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found with ID: " + id));
    }

    @Transactional
    public Assignment createAssignment(Assignment assignment) {
        Long id = assignmentRepository.save(assignment);
        assignment.setAssignmentId(id);
        activityLogRepository.log(assignment.getFacultyId(), "ASSIGNMENT_CREATED", "ACADEMIC",
                "Created assignment " + assignment.getTitle() + " for course #" + assignment.getCourseId());
        return assignment;
    }

    public List<AssignmentSubmission> getSubmissionsForAssignment(Long assignmentId) {
        return assignmentRepository.findSubmissionsByAssignmentId(assignmentId);
    }

    @Transactional
    public boolean submitAssignment(AssignmentSubmission submission) {
        boolean success = assignmentRepository.submitAssignment(submission);
        if (success) {
            activityLogRepository.log(submission.getStudentId(), "ASSIGNMENT_SUBMITTED", "ACADEMIC",
                    "Student submitted solution for assignment #" + submission.getAssignmentId());
        }
        return success;
    }

    @Transactional
    public boolean evaluateSubmission(Long submissionId, int score, String feedback, Long studentUserId) {
        boolean success = assignmentRepository.evaluateSubmission(submissionId, score, feedback);
        if (success && studentUserId != null) {
            notificationService.sendNotification(
                    studentUserId,
                    "Assignment Evaluated",
                    "Your assignment has been graded. Score: " + score + ". Feedback: " + feedback,
                    "ASSIGNMENT",
                    "/assignments"
            );
        }
        return success;
    }

    @Transactional
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}
