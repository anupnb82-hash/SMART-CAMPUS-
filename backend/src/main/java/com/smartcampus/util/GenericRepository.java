package com.smartcampus.util;

import java.util.List;
import java.util.Optional;

/**
 * Generic Repository abstraction demonstrating OOP Generics.
 * 
 * @param <T>  Entity model type
 * @param <ID> Primary key identifier type
 */
public interface GenericRepository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    boolean update(T entity);
    boolean deleteById(ID id);
    long count();
}
