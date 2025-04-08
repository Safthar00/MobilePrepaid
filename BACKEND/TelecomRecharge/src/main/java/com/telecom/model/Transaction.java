package com.telecom.model;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Date;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @Column(name = "trans_id", length = 100)
    @JsonProperty("trans_id") 
    private String transId;

    @Column(name = "amount", nullable = false)
    @JsonProperty("amount")
    private Double amount;

    @Column(name = "validity") 
    private String validity;
    
    @Column(name = "payment_mode", nullable = false, length = 20)
    @JsonProperty("payment_mode")
    private String paymentMode;

    @Column(name = "status", nullable = false, length = 20)
    @JsonProperty("status")
    private String status;

    @Column(name = "tran_date", nullable = false)
    @JsonProperty("tran_date")
    private Date tranDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

}