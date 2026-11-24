package com.smartcampus.service;

import com.smartcampus.model.Department;
import com.smartcampus.repository.ActivityLogRepository;
import com.smartcampus.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final ActivityLogRepository activityLogRepository;

    public DepartmentService(DepartmentRepository departmentRepository, ActivityLogRepository activityLogRepository) {
        this.departmentRepository = departmentRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + id));
    }

    @Transactional
    public Department createDepartment(Department dept) {
        Long id = departmentRepository.save(dept);
        dept.setDepartmentId(id);
        activityLogRepository.log(1L, "DEPARTMENT_CREATED", "DEPARTMENT", 
                "Created department: " + dept.getDepartmentName() + " [" + dept.getDepartmentCode() + "]");
        return dept;
    }

    @Transactional
    public Department updateDepartment(Long id, Department update) {
        Department existing = getDepartmentById(id);
        existing.setDepartmentCode(update.getDepartmentCode());
        existing.setDepartmentName(update.getDepartmentName());
        existing.setBuilding(update.getBuilding());
        existing.setHeadOfDepartment(update.getHeadOfDepartment());
        existing.setContactEmail(update.getContactEmail());
        existing.setContactPhone(update.getContactPhone());

        departmentRepository.update(existing);
        activityLogRepository.log(1L, "DEPARTMENT_UPDATED", "DEPARTMENT", "Updated department ID: " + id);
        return existing;
    }

    @Transactional
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
        activityLogRepository.log(1L, "DEPARTMENT_DELETED", "DEPARTMENT", "Deleted department ID: " + id);
    }
}
