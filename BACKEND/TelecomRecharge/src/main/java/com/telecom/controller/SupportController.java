package com.telecom.controller;

import com.telecom.model.Support;
import com.telecom.service.SupportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/support")
@CrossOrigin(origins = "http://127.0.0.1:5503,http://127.0.0.1:5504")
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @PostMapping
    public ResponseEntity<Support> submitSupportMessage(@RequestBody Support support) {
        Support savedSupport = supportService.saveSupportMessage(support);
        return ResponseEntity.ok(savedSupport);
    }

    @GetMapping
    public ResponseEntity<List<Support>> getAllSupportMessages() {
        List<Support> supportMessages = supportService.getAllSupportMessages();
        return ResponseEntity.ok(supportMessages);
    }
}