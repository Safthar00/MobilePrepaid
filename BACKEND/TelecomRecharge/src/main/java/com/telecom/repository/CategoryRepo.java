package com.telecom.repository;

import com.telecom.model.TelecomCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepo extends JpaRepository<TelecomCategory, Long> {
    // Default methods (findAll, findById, existsById, deleteById) are sufficient
}