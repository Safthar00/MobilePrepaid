package com.telecom.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.sql.Date;

/**
 * Data Transfer Object (DTO) for representing Transaction responses.
 * This class is used to serialize Transaction data to JSON, avoiding Hibernate proxy issues.
 */
@Data
public class TransactionResponseDTO {

    @JsonProperty("trans_id")
    private String transId;

    @JsonProperty("amount")
    private Double amount;

    @JsonProperty("validity")
    private String validity;

    @JsonProperty("payment_mode")
    private String paymentMode;

    @JsonProperty("status")
    private String status;

    @JsonProperty("tran_date")
    private Date tranDate;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("customer_name")
    private String customerName;

    @JsonProperty("phone_number")
    private String phoneNumber;
    
    // Default constructor (required for Jackson deserialization)
    public TransactionResponseDTO() {
    }

    // Parameterized constructor (optional, for convenience)
    public TransactionResponseDTO(String transId, Double amount, String validity, String paymentMode,
                                 String status, Date tranDate, Long userId, String customerName, String phoneNumber) {
        this.transId = transId;
        this.amount = amount;
        this.validity = validity;
        this.paymentMode = paymentMode;
        this.status = status;
        this.tranDate = tranDate;
        this.userId = userId;
        this.customerName = customerName;
        this.phoneNumber = phoneNumber;
    }
}