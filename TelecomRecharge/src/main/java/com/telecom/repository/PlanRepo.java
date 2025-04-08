package com.telecom.repository;

import com.telecom.model.TelecomPlan;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanRepo extends JpaRepository<TelecomPlan, Long> {
    @EntityGraph(attributePaths = {"category"})
    List<TelecomPlan> findAll();
    
    @EntityGraph(attributePaths = {"category"})
    List<TelecomPlan> findByStatus(String status);

    @EntityGraph(attributePaths = {"category"})
    List<TelecomPlan> findByCategoryId(Long catId);

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM TelecomPlan p WHERE " +
           "LOWER(p.name) LIKE LOWER(concat('%', :term, '%')) OR " +
           "LOWER(p.validity) LIKE LOWER(concat('%', :term, '%')) OR " +
           "LOWER(p.data) LIKE LOWER(concat('%', :term, '%')) OR " +
           "LOWER(p.sms) LIKE LOWER(concat('%', :term, '%')) OR " +
           "LOWER(p.calls) LIKE LOWER(concat('%', :term, '%')) OR " +
           "LOWER(p.benefits) LIKE LOWER(concat('%', :term, '%')) OR " +
           "CAST(p.price AS string) LIKE LOWER(concat('%', :term, '%'))")
    List<TelecomPlan> searchPlans(@Param("term") String term);
        
    Optional<TelecomPlan> findById(Long planId);

    @Query("SELECT p FROM TelecomPlan p JOIN FETCH p.category WHERE p.id = :planId")
    Optional<TelecomPlan> findByIdWithCategory(@Param("planId") Long planId);
    
}