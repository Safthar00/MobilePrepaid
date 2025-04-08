package com.telecom.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data 
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "telecom_plans")
public class TelecomPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false)
    @NotNull(message = "Category is required")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private TelecomCategory category;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, length = 50)
    private String validity;

    @Column(nullable = false, length = 50)
    private String data;

    @Column(nullable = false, length = 50)
    private String sms;

    @Column(nullable = false, length = 50)
    private String calls;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";
   
}