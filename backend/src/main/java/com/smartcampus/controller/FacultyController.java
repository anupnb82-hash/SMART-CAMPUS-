package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Faculty;
import com.smartcampus.service.FacultyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Faculty>>> getAllFaculty(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId) {
        List<Faculty> list = (search != null || departmentId != null)
                ? facultyService.searchFaculty(search, departmentId)
                : facultyService.getAllFaculty();
        return ResponseEntity.ok(ApiResponse.ok("Faculty list retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Faculty>> getFacultyById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Faculty details", facultyService.getFacultyById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Faculty>> createFaculty(@RequestBody Faculty faculty) {
        Faculty created = facultyService.createFaculty(faculty, "Faculty@123");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Faculty created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Faculty>> updateFaculty(@PathVariable Long id, @RequestBody Faculty faculty) {
        Faculty updated = facultyService.updateFaculty(id, faculty);
        return ResponseEntity.ok(ApiResponse.ok("Faculty updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFaculty(@PathVariable Long id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.ok(ApiResponse.ok("Faculty profile deactivated successfully", "ID " + id));
    }
}
