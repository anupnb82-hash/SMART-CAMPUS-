package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Assignment;
import com.smartcampus.model.AssignmentSubmission;
import com.smartcampus.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Assignment>>> getAllAssignments(@RequestParam(required = false) Long courseId) {
        List<Assignment> list = courseId != null ? assignmentService.getAssignmentsByCourse(courseId) : assignmentService.getAllAssignments();
        return ResponseEntity.ok(ApiResponse.ok("Assignments retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Assignment>> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Assignment details", assignmentService.getAssignmentById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(@RequestBody Assignment assignment) {
        Assignment created = assignmentService.createAssignment(assignment);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Assignment published", created));
    }

    @GetMapping("/{id}/submissions")
    public ResponseEntity<ApiResponse<List<AssignmentSubmission>>> getSubmissions(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Submissions retrieved", assignmentService.getSubmissionsForAssignment(id)));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<String>> submitAssignment(
            @PathVariable Long id,
            @RequestBody AssignmentSubmission submission) {
        submission.setAssignmentId(id);
        assignmentService.submitAssignment(submission);
        return ResponseEntity.ok(ApiResponse.ok("Assignment submission uploaded successfully", "Assignment #" + id));
    }

    @PostMapping("/submissions/{subId}/grade")
    public ResponseEntity<ApiResponse<String>> gradeSubmission(
            @PathVariable Long subId,
            @RequestBody Map<String, Object> body) {
        int score = (Integer) body.get("score");
        String feedback = (String) body.get("feedback");
        Long studentUserId = body.get("studentUserId") != null ? Long.valueOf(body.get("studentUserId").toString()) : null;

        assignmentService.evaluateSubmission(subId, score, feedback, studentUserId);
        return ResponseEntity.ok(ApiResponse.ok("Submission evaluated and feedback dispatched to student", "Submission #" + subId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.ok("Assignment deleted", "ID " + id));
    }
}
