package com.telecom.service;

import com.telecom.model.Transaction;
import com.telecom.repository.TransactionRepository;

import java.util.Calendar;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserUserId(userId);
    }
    public List<Transaction> getExpiringTransactions(int days) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, days);
        java.util.Date utilDate = calendar.getTime();
        Date thresholdDate = new Date(utilDate.getTime());
        return transactionRepository.findExpiringTransactions(thresholdDate);
    }
}