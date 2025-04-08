package com.telecom.service;

import com.telecom.model.Support;
import com.telecom.repository.SupportRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupportService {

    private final SupportRepo supportRepo;

    public SupportService(SupportRepo supportRepo) {
        this.supportRepo = supportRepo;
    }

    // Save a support message
    public Support saveSupportMessage(Support support) {
        return supportRepo.save(support);
    }

    // Get all support messages
    public List<Support> getAllSupportMessages() {
        return supportRepo.findAll();
    }
}