package com.telecom.controller;

import com.telecom.DTO.InvoiceRequestDTO;
import com.telecom.DTO.TransactionRequestDTO;
import com.telecom.DTO.TransactionResponseDTO;
import com.telecom.model.Transaction;
import com.telecom.model.Users;
import com.telecom.repository.UsersRepo;
import com.telecom.security.TokenManager;
import com.telecom.service.EmailService;
import com.telecom.service.TransactionService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UsersRepo acctRepo;

    @Autowired
    private TokenManager tokenMgr;
    
    @Autowired
    private EmailService emailService;
    
    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequestDTO request) {
        try {
            System.out.println("Received transaction: " + request);
            if (request.getTransId() == null || request.getTransId().isEmpty()) {
                return ResponseEntity.badRequest().body("Transaction ID (trans_id) is required");
            }

            // Fetch the existing Users entity
            Users user = acctRepo.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

            // Create Transaction object
            Transaction transaction = new Transaction();
            transaction.setTransId(request.getTransId());
            transaction.setAmount(request.getAmount());
            transaction.setValidity(request.getValidity());
            transaction.setPaymentMode(request.getPaymentMode());
            transaction.setStatus(request.getStatus());
            transaction.setTranDate(request.getTranDate());
            transaction.setUser(user);

            Transaction savedTransaction = transactionService.saveTransaction(transaction);
            return ResponseEntity.ok(savedTransaction);
        } catch (Exception e) {
            System.err.println("Error saving transaction: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving transaction: " + e.getMessage());
        }
    }
    
 
    @GetMapping("/user-transactions")
    public ResponseEntity<List<TransactionResponseDTO>> getUserTransactions(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(null);
            }
            String token = authHeader.substring(7);
            String username = tokenMgr.getUsernameFromToken(token);
            Users user = acctRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            List<Transaction> transactions = transactionService.getTransactionsByUserId(user.getUserId());
            List<TransactionResponseDTO> responseDTOs = transactions.stream().map(transaction -> {
                TransactionResponseDTO dto = new TransactionResponseDTO();
                dto.setTransId(transaction.getTransId());
                dto.setAmount(transaction.getAmount());
                dto.setValidity(transaction.getValidity());
                dto.setPaymentMode(transaction.getPaymentMode());
                dto.setStatus(transaction.getStatus());
                dto.setTranDate(transaction.getTranDate());
                dto.setUserId(transaction.getUser().getUserId());
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            System.err.println("Error retrieving user transactions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/expiring")
    public ResponseEntity<List<TransactionResponseDTO>> getExpiringTransactions(
            @RequestParam(defaultValue = "3") int days,
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(null);
            }
            String token = authHeader.substring(7);
            String username = tokenMgr.getUsernameFromToken(token);
            Users user = acctRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Transaction> transactions = transactionService.getExpiringTransactions(days);
            List<TransactionResponseDTO> responseDTOs = transactions.stream().map(transaction -> {
                TransactionResponseDTO dto = new TransactionResponseDTO();
                dto.setTransId(transaction.getTransId());
                dto.setAmount(transaction.getAmount());
                dto.setValidity(transaction.getValidity());
                dto.setPaymentMode(transaction.getPaymentMode());
                dto.setStatus(transaction.getStatus());
                dto.setTranDate(transaction.getTranDate());
                dto.setUserId(transaction.getUser().getUserId());
                dto.setCustomerName(transaction.getUser().getFirstName() + " " + transaction.getUser().getLastName());
                dto.setPhoneNumber(transaction.getUser().getPhone());
                return dto;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(responseDTOs);
        } catch (Exception e) {
            System.err.println("Error retrieving expiring transactions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @PostMapping("/send-invoice")
    public ResponseEntity<?> sendInvoice(@RequestBody InvoiceRequestDTO request) {
        try {
            // Fetch the user
        	System.out.println("Received pdfBase64: " + request.getPdfBase64()); // Add this line
            Users user = acctRepo.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));
            
            // Send email with PDF
            emailService.sendInvoiceEmail(user.getEmail(), request.getPdfBase64(), request.getTransactionId());
            return ResponseEntity.ok("Invoice email sent successfully");
        } catch (Exception e) {
            System.err.println("Error sending invoice email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error sending invoice email: " + e.getMessage());
        }
    }
}