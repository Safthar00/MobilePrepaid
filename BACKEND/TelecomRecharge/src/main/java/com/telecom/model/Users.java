package com.telecom.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "fname", nullable = false, length = 50)
    private String firstName;

    @Column(name = "lname", nullable = false, length = 50)
    private String lastName;

    @Column(name = "phone", nullable = false, unique = true, length = 15)
    private String phone;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private boolean active = false;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(length = 255, nullable=true)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private UsersRole role; 
    
    
  
    @Column(name = "quickno", length = 15) 
    private String quickno;
}
