package com.telecom.service;

import com.telecom.model.TelecomCategory;
import com.telecom.model.TelecomPlan;
import com.telecom.repository.PlanRepo;

import jakarta.transaction.Transactional;

import com.telecom.repository.CategoryRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    private final PlanRepo planRepo;
    private final CategoryRepo catRepo;

    public PlanService(PlanRepo planRepo, CategoryRepo catRepo) {
        this.planRepo = planRepo;
        this.catRepo = catRepo;
    }
    
    public List<TelecomPlan> listActivePlans() {
        return planRepo.findByStatus("ACTIVE");
    }

    public List<TelecomPlan> listPlans() {
        return planRepo.findAll();
    }

    public Optional<TelecomPlan> getPlan(Long planId) {
        return planRepo.findById(planId);
    }

    public List<TelecomPlan> listByCategory(Long catId) {
        return planRepo.findByCategoryId(catId);
    }

    
    public List<TelecomPlan> searchPlans(String term) {
        return planRepo.searchPlans(term.toLowerCase()); 
    }

    @Transactional
    public TelecomPlan addPlan(TelecomPlan newPlan) {
        if (newPlan.getCategory() == null || newPlan.getCategory().getId() == null) {
            throw new IllegalArgumentException("Category ID is required");
        }
        Long catId = newPlan.getCategory().getId();
        if (!catRepo.existsById(catId)) {
            throw new IllegalArgumentException("Category with ID " + catId + " not found");
        }
        TelecomPlan savedPlan = planRepo.save(newPlan);
        return planRepo.findByIdWithCategory(savedPlan.getId())
                .orElseThrow(() -> new IllegalArgumentException("Plan not found after saving"));
    }

    @Transactional
    public TelecomPlan modifyPlan(Long planId, TelecomPlan planData) {
        return planRepo.findById(planId)
                .map(plan -> {
                	Long catId = planData.getCategory().getId();
                    TelecomCategory category = catRepo.findById(catId)
                            .orElseThrow(() -> new IllegalArgumentException("Category with ID " + catId + " not found"));
                    plan.setCategory(category);
                    plan.setName(planData.getName());
                    plan.setPrice(planData.getPrice());
                    plan.setValidity(planData.getValidity());
                    plan.setData(planData.getData());
                    plan.setSms(planData.getSms());
                    plan.setCalls(planData.getCalls());
                    plan.setBenefits(planData.getBenefits());
                    return planRepo.save(plan);
                })
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
    }

    @Transactional
    public void deletePlan(Long planId) {
        planRepo.deleteById(planId);
    }
    
    @Transactional
    public TelecomPlan togglePlanStatus(Long planId) {
        TelecomPlan plan = planRepo.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found with ID: " + planId));
        plan.setStatus(plan.getStatus().equals("ACTIVE") ? "INACTIVE" : "ACTIVE");
        TelecomPlan updatedPlan = planRepo.save(plan);
        return planRepo.findByIdWithCategory(updatedPlan.getId())
                .orElseThrow(() -> new IllegalArgumentException("Plan not found after updating"));
    }
    
    
    
    }
