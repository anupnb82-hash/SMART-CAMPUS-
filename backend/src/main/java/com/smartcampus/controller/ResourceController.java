package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Classroom;
import com.smartcampus.model.Equipment;
import com.smartcampus.model.Laboratory;
import com.smartcampus.service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllResources() {
        return ResponseEntity.ok(ApiResponse.ok("Resources retrieved", resourceService.getAllCampusResources()));
    }

    @GetMapping("/classrooms")
    public ResponseEntity<ApiResponse<List<Classroom>>> getClassrooms() {
        return ResponseEntity.ok(ApiResponse.ok("Classrooms retrieved", resourceService.getAllClassrooms()));
    }

    @GetMapping("/laboratories")
    public ResponseEntity<ApiResponse<List<Laboratory>>> getLaboratories() {
        return ResponseEntity.ok(ApiResponse.ok("Laboratories retrieved", resourceService.getAllLaboratories()));
    }

    @GetMapping("/equipment")
    public ResponseEntity<ApiResponse<List<Equipment>>> getEquipment() {
        return ResponseEntity.ok(ApiResponse.ok("Equipment retrieved", resourceService.getAllEquipment()));
    }

    @PostMapping("/classrooms")
    public ResponseEntity<ApiResponse<Classroom>> createClassroom(@RequestBody Classroom classroom) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Classroom added", resourceService.createClassroom(classroom)));
    }

    @PostMapping("/laboratories")
    public ResponseEntity<ApiResponse<Laboratory>> createLaboratory(@RequestBody Laboratory lab) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Laboratory added", resourceService.createLaboratory(lab)));
    }

    @PostMapping("/equipment")
    public ResponseEntity<ApiResponse<Equipment>> createEquipment(@RequestBody Equipment eq) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Equipment added", resourceService.createEquipment(eq)));
    }

    /**
     * FEATURE D: Alternative Resource Recommendations
     */
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<ApiResponse<List<Classroom>>> getAlternativeRecommendations(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int minCapacity) {
        List<Classroom> alternatives = resourceService.getAlternativeClassrooms(id, minCapacity);
        return ResponseEntity.ok(ApiResponse.ok("Alternative recommendations", alternatives));
    }
}
