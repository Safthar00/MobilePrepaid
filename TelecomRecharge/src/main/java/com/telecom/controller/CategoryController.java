package com.telecom.controller;

import com.telecom.model.TelecomCategory;
import com.telecom.model.TelecomPlan;
import com.telecom.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://127.0.0.1:5503,http://127.0.0.1:5504")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<TelecomCategory> getCategories() {
        return categoryService.getCategories();
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelecomPlan> addPlan(@RequestBody TelecomPlan newPlan) {
        return ResponseEntity.ok(categoryService.addPlan(newPlan));
    }

    @PutMapping("/modify/{catId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelecomCategory> modifyCategory(@PathVariable Long catId, @RequestBody TelecomCategory catData) {
        return ResponseEntity.ok(categoryService.modifyCategory(catId, catData));
    }

    @DeleteMapping("/delete/{catId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long catId) {
        categoryService.deleteCategory(catId);
        return ResponseEntity.ok().build();
    }
}