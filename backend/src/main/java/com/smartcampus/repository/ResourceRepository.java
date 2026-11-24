package com.smartcampus.repository;

import com.smartcampus.model.Classroom;
import com.smartcampus.model.Equipment;
import com.smartcampus.model.Laboratory;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class ResourceRepository {

    private final JdbcTemplate jdbcTemplate;

    public ResourceRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ================= CLASSROOMS =================
    public List<Classroom> findAllClassrooms() {
        String sql = "SELECT classroom_id, room_number, building, floor, capacity, has_projector, has_smartboard, has_air_conditioning, status FROM classrooms ORDER BY room_number ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Classroom c = new Classroom();
            c.setClassroomId(rs.getLong("classroom_id"));
            c.setRoomNumber(rs.getString("room_number"));
            c.setBuilding(rs.getString("building"));
            c.setFloor(rs.getInt("floor"));
            c.setCapacity(rs.getInt("capacity"));
            c.setHasProjector(rs.getBoolean("has_projector"));
            c.setHasSmartboard(rs.getBoolean("has_smartboard"));
            c.setHasAirConditioning(rs.getBoolean("has_air_conditioning"));
            c.setStatus(rs.getString("status"));
            return c;
        });
    }

    public Optional<Classroom> findClassroomById(Long id) {
        String sql = "SELECT classroom_id, room_number, building, floor, capacity, has_projector, has_smartboard, has_air_conditioning, status FROM classrooms WHERE classroom_id = ?";
        try {
            Classroom c = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Classroom room = new Classroom();
                room.setClassroomId(rs.getLong("classroom_id"));
                room.setRoomNumber(rs.getString("room_number"));
                room.setBuilding(rs.getString("building"));
                room.setFloor(rs.getInt("floor"));
                room.setCapacity(rs.getInt("capacity"));
                room.setHasProjector(rs.getBoolean("has_projector"));
                room.setHasSmartboard(rs.getBoolean("has_smartboard"));
                room.setHasAirConditioning(rs.getBoolean("has_air_conditioning"));
                room.setStatus(rs.getString("status"));
                return room;
            }, id);
            return Optional.ofNullable(c);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long saveClassroom(Classroom c) {
        String sql = "INSERT INTO classrooms (room_number, building, floor, capacity, has_projector, has_smartboard, has_air_conditioning, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, c.getRoomNumber());
            ps.setString(2, c.getBuilding());
            ps.setInt(3, c.getFloor());
            ps.setInt(4, c.getCapacity());
            ps.setBoolean(5, c.isHasProjector());
            ps.setBoolean(6, c.isHasSmartboard());
            ps.setBoolean(7, c.isHasAirConditioning());
            ps.setString(8, c.getStatus());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean updateClassroom(Classroom c) {
        String sql = "UPDATE classrooms SET room_number = ?, building = ?, floor = ?, capacity = ?, has_projector = ?, has_smartboard = ?, has_air_conditioning = ?, status = ? WHERE classroom_id = ?";
        return jdbcTemplate.update(sql,
                c.getRoomNumber(),
                c.getBuilding(),
                c.getFloor(),
                c.getCapacity(),
                c.isHasProjector(),
                c.isHasSmartboard(),
                c.isHasAirConditioning(),
                c.getStatus(),
                c.getClassroomId()
        ) > 0;
    }

    public boolean deleteClassroom(Long id) {
        return jdbcTemplate.update("DELETE FROM classrooms WHERE classroom_id = ?", id) > 0;
    }

    // ================= LABORATORIES =================
    public List<Laboratory> findAllLaboratories() {
        String sql = """
            SELECT l.lab_id, l.lab_name, l.building, l.floor, l.capacity, l.department_id,
                   d.department_name, l.safety_level, l.status
            FROM laboratories l
            JOIN departments d ON l.department_id = d.department_id
            ORDER BY l.lab_name ASC
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Laboratory lab = new Laboratory();
            lab.setLabId(rs.getLong("lab_id"));
            lab.setLabName(rs.getString("lab_name"));
            lab.setBuilding(rs.getString("building"));
            lab.setFloor(rs.getInt("floor"));
            lab.setCapacity(rs.getInt("capacity"));
            lab.setDepartmentId(rs.getLong("department_id"));
            lab.setDepartmentName(rs.getString("department_name"));
            lab.setSafetyLevel(rs.getString("safety_level"));
            lab.setStatus(rs.getString("status"));
            return lab;
        });
    }

    public Optional<Laboratory> findLaboratoryById(Long id) {
        String sql = """
            SELECT l.lab_id, l.lab_name, l.building, l.floor, l.capacity, l.department_id,
                   d.department_name, l.safety_level, l.status
            FROM laboratories l
            JOIN departments d ON l.department_id = d.department_id
            WHERE l.lab_id = ?
        """;
        try {
            Laboratory lab = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Laboratory l = new Laboratory();
                l.setLabId(rs.getLong("lab_id"));
                l.setLabName(rs.getString("lab_name"));
                l.setBuilding(rs.getString("building"));
                l.setFloor(rs.getInt("floor"));
                l.setCapacity(rs.getInt("capacity"));
                l.setDepartmentId(rs.getLong("department_id"));
                l.setDepartmentName(rs.getString("department_name"));
                l.setSafetyLevel(rs.getString("safety_level"));
                l.setStatus(rs.getString("status"));
                return l;
            }, id);
            return Optional.ofNullable(lab);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long saveLaboratory(Laboratory lab) {
        String sql = "INSERT INTO laboratories (lab_name, building, floor, capacity, department_id, safety_level, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, lab.getLabName());
            ps.setString(2, lab.getBuilding());
            ps.setInt(3, lab.getFloor());
            ps.setInt(4, lab.getCapacity());
            ps.setLong(5, lab.getDepartmentId());
            ps.setString(6, lab.getSafetyLevel());
            ps.setString(7, lab.getStatus());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean updateLaboratory(Laboratory lab) {
        String sql = "UPDATE laboratories SET lab_name = ?, building = ?, floor = ?, capacity = ?, department_id = ?, safety_level = ?, status = ? WHERE lab_id = ?";
        return jdbcTemplate.update(sql,
                lab.getLabName(),
                lab.getBuilding(),
                lab.getFloor(),
                lab.getCapacity(),
                lab.getDepartmentId(),
                lab.getSafetyLevel(),
                lab.getStatus(),
                lab.getLabId()
        ) > 0;
    }

    public boolean deleteLaboratory(Long id) {
        return jdbcTemplate.update("DELETE FROM laboratories WHERE lab_id = ?", id) > 0;
    }

    // ================= EQUIPMENT =================
    public List<Equipment> findAllEquipment() {
        String sql = """
            SELECT e.equipment_id, e.equipment_code, e.equipment_name, e.lab_id,
                   l.lab_name, e.department_id, e.category, e.total_quantity,
                   e.available_quantity, e.condition_status
            FROM equipment e
            LEFT JOIN laboratories l ON e.lab_id = l.lab_id
            ORDER BY e.equipment_name ASC
        """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Equipment eq = new Equipment();
            eq.setEquipmentId(rs.getLong("equipment_id"));
            eq.setEquipmentCode(rs.getString("equipment_code"));
            eq.setEquipmentName(rs.getString("equipment_name"));
            eq.setLabId(rs.getObject("lab_id") != null ? rs.getLong("lab_id") : null);
            eq.setLabName(rs.getString("lab_name"));
            eq.setDepartmentId(rs.getLong("department_id"));
            eq.setCategory(rs.getString("category"));
            eq.setTotalQuantity(rs.getInt("total_quantity"));
            eq.setAvailableQuantity(rs.getInt("available_quantity"));
            eq.setConditionStatus(rs.getString("condition_status"));
            return eq;
        });
    }

    public Optional<Equipment> findEquipmentById(Long id) {
        String sql = """
            SELECT e.equipment_id, e.equipment_code, e.equipment_name, e.lab_id,
                   l.lab_name, e.department_id, e.category, e.total_quantity,
                   e.available_quantity, e.condition_status
            FROM equipment e
            LEFT JOIN laboratories l ON e.lab_id = l.lab_id
            WHERE e.equipment_id = ?
        """;
        try {
            Equipment eq = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Equipment e = new Equipment();
                e.setEquipmentId(rs.getLong("equipment_id"));
                e.setEquipmentCode(rs.getString("equipment_code"));
                e.setEquipmentName(rs.getString("equipment_name"));
                e.setLabId(rs.getObject("lab_id") != null ? rs.getLong("lab_id") : null);
                e.setLabName(rs.getString("lab_name"));
                e.setDepartmentId(rs.getLong("department_id"));
                e.setCategory(rs.getString("category"));
                e.setTotalQuantity(rs.getInt("total_quantity"));
                e.setAvailableQuantity(rs.getInt("available_quantity"));
                e.setConditionStatus(rs.getString("condition_status"));
                return e;
            }, id);
            return Optional.ofNullable(eq);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Long saveEquipment(Equipment eq) {
        String sql = "INSERT INTO equipment (equipment_code, equipment_name, lab_id, department_id, category, total_quantity, available_quantity, condition_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, eq.getEquipmentCode());
            ps.setString(2, eq.getEquipmentName());
            if (eq.getLabId() != null) ps.setLong(3, eq.getLabId());
            else ps.setNull(3, java.sql.Types.BIGINT);
            ps.setLong(4, eq.getDepartmentId());
            ps.setString(5, eq.getCategory());
            ps.setInt(6, eq.getTotalQuantity());
            ps.setInt(7, eq.getAvailableQuantity());
            ps.setString(8, eq.getConditionStatus());
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public boolean updateEquipment(Equipment eq) {
        String sql = "UPDATE equipment SET equipment_code = ?, equipment_name = ?, lab_id = ?, department_id = ?, category = ?, total_quantity = ?, available_quantity = ?, condition_status = ? WHERE equipment_id = ?";
        return jdbcTemplate.update(sql,
                eq.getEquipmentCode(),
                eq.getEquipmentName(),
                eq.getLabId(),
                eq.getDepartmentId(),
                eq.getCategory(),
                eq.getTotalQuantity(),
                eq.getAvailableQuantity(),
                eq.getConditionStatus(),
                eq.getEquipmentId()
        ) > 0;
    }

    public boolean deleteEquipment(Long id) {
        return jdbcTemplate.update("DELETE FROM equipment WHERE equipment_id = ?", id) > 0;
    }

    public long countClassrooms() { return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM classrooms", Long.class); }
    public long countLaboratories() { return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM laboratories", Long.class); }
    public long countEquipment() { return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM equipment", Long.class); }
}
