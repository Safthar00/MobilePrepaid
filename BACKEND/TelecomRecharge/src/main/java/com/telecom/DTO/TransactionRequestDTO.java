package com.telecom.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.sql.Date;

@Data
public class TransactionRequestDTO {
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
}