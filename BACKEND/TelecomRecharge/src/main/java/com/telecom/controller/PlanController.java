package com.telecom.controller;

import com.telecom.model.TelecomPlan;
import com.telecom.service.PlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
@CrossOrigin(origins = "http://127.0.0.1:5503,http://127.0.0.1:5504")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }
    
    @GetMapping
    public List<TelecomPlan> listPlans() {
        return planService.listPlans();
    }

    @GetMapping("/active")
    public List<TelecomPlan> listActivePlans() {
        return planService.listActivePlans();
    }
    
    @GetMapping("/{planId}")
    public ResponseEntity<TelecomPlan> getPlan(@PathVariable Long planId) {
        return planService.getPlan(planId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{catId}")
    public List<TelecomPlan> listByCategory(@PathVariable Long catId) {
        return planService.listByCategory(catId);
    }

    @GetMapping("/search")
    public List<TelecomPlan> searchPlans(@RequestParam String term) {
        return planService.searchPlans(term);
    }
    
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelecomPlan> addPlan(@RequestBody TelecomPlan newPlan) {
        return ResponseEntity.ok(planService.addPlan(newPlan));
    }

    @PutMapping("/modify/{planId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelecomPlan> modifyPlan(@PathVariable Long planId, @RequestBody TelecomPlan planData) {
        return ResponseEntity.ok(planService.modifyPlan(planId, planData));
    }

    @DeleteMapping("/delete/{planId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long planId) {
        planService.deletePlan(planId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/toggle-status/{planId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelecomPlan> togglePlanStatus(@PathVariable Long planId) {
        TelecomPlan updatedPlan = planService.togglePlanStatus(planId);
        return ResponseEntity.ok(updatedPlan);
    }
}