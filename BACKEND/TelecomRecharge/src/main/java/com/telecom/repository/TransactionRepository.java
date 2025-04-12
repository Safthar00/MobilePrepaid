package com.telecom.repository;

import com.telecom.model.Transaction;

import java.util.List;
import java.sql.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
	List<Transaction> findByUserUserId(Long userId);
	
	@Query("SELECT t FROM Transaction t WHERE " +
	           "DATEADD(day, CAST(t.validity AS INTEGER), t.tranDate) <= :thresholdDate " +
	           "AND DATEADD(day, CAST(t.validity AS INTEGER), t.tranDate) >= CURRENT_DATE")
	    List<Transaction> findExpiringTransactions(@Param("thresholdDate") Date thresholdDate);
}