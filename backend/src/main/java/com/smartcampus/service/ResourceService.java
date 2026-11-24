package com.smartcampus.service;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Classroom;
import com.smartcampus.model.Equipment;
import com.smartcampus.model.Laboratory;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.util.StreamFilters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ActivityLogRepository activityLogRepository;

    public ResourceService(ResourceRepository resourceRepository, ActivityLogRepository activityLogRepository) {
        this.resourceRepository = resourceRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public List<Classroom> getAllClassrooms() { return resourceRepository.findAllClassrooms(); }
    public Classroom getClassroomById(Long id) {
        return resourceRepository.findClassroomById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CLASSROOM", id));
    }

    public List<Laboratory> getAllLaboratories() { return resourceRepository.findAllLaboratories(); }
    public Laboratory getLaboratoryById(Long id) {
        return resourceRepository.findLaboratoryById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LABORATORY", id));
    }

    public List<Equipment> getAllEquipment() { return resourceRepository.findAllEquipment(); }
    public Equipment getEquipmentById(Long id) {
        return resourceRepository.findEquipmentById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EQUIPMENT", id));
    }

    public Map<String, Object> getAllCampusResources() {
        Map<String, Object> map = new HashMap<>();
        map.put("classrooms", getAllClassrooms());
        map.put("laboratories", getAllLaboratories());
        map.put("equipment", getAllEquipment());
        return map;
    }

    /**
     * FEATURE D: Alternative Resource Recommendations
     * When a classroom or lab is unavailable, recommends compatible alternatives
     * based on capacity, facilities, and location.
     */
    public List<Classroom> getAlternativeClassrooms(Long currentRoomId, int minCapacity) {
        Classroom current = getClassroomById(currentRoomId);
        int targetCapacity = minCapacity > 0 ? minCapacity : current.getCapacity();
        return StreamFilters.findAlternativeClassrooms(
                getAllClassrooms(), 
                currentRoomId, 
                targetCapacity, 
                current.isHasProjector()
        );
    }

    @Transactional
    public Classroom createClassroom(Classroom classroom) {
        Long id = resourceRepository.saveClassroom(classroom);
        classroom.setClassroomId(id);
        activityLogRepository.log(1L, "RESOURCE_CREATED", "FACILITY", "Created classroom " + classroom.getRoomNumber());
        return classroom;
    }

    @Transactional
    public Laboratory createLaboratory(Laboratory lab) {
        Long id = resourceRepository.saveLaboratory(lab);
        lab.setLabId(id);
        activityLogRepository.log(1L, "RESOURCE_CREATED", "FACILITY", "Created laboratory " + lab.getLabName());
        return lab;
    }

    @Transactional
    public Equipment createEquipment(Equipment eq) {
        Long id = resourceRepository.saveEquipment(eq);
        eq.setEquipmentId(id);
        activityLogRepository.log(1L, "RESOURCE_CREATED", "FACILITY", "Created equipment " + eq.getEquipmentName());
        return eq;
    }
}
