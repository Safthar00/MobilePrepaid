package com.telecom.service;

import com.telecom.model.TelecomCategory;
import com.telecom.model.TelecomPlan;
import com.telecom.repository.CategoryRepo;
import com.telecom.repository.PlanRepo;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepo catRepo;
    private final PlanRepo planRepo;

    public CategoryService(CategoryRepo catRepo, PlanRepo planRepo) {
        this.catRepo = catRepo;
        this.planRepo = planRepo;
    }

    public List<TelecomCategory> getCategories() {
        return catRepo.findAll();
    }

    @Transactional
    public TelecomPlan addPlan(TelecomPlan newPlan) {
        if (newPlan.getCategory() == null || newPlan.getCategory().getId() == null) {
            throw new IllegalArgumentException("Valid category ID is required");
        }

        Long catId = newPlan.getCategory().getId();
        if (!catRepo.existsById(catId)) {
            throw new IllegalArgumentException("Category with ID " + catId + " not found");
        }

        return planRepo.save(newPlan);
    }

    public TelecomCategory modifyCategory(Long catId, TelecomCategory catData) {
        return catRepo.findById(catId)
                .map(cat -> {
                    cat.setName(catData.getName());
                    return catRepo.save(cat);
                })
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    public void deleteCategory(Long catId) {
        if (catRepo.existsById(catId)) {
            catRepo.deleteById(catId);
        } else {
            throw new IllegalArgumentException("Category not found");
        }
    }
}