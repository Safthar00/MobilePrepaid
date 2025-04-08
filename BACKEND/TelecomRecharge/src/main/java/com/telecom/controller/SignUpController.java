package com.telecom.controller;

import com.telecom.model.Users;
import com.telecom.model.UsersRole;
import com.telecom.repository.UsersRepo;
import com.telecom.repository.UsersRoleRepo;
import com.telecom.security.TokenManager;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://127.0.0.1:5503,http://127.0.0.1:5504")
public class SignUpController {
    private final UsersRepo acctRepo;
    private final UsersRoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder; 
    private final TokenManager tokenMgr; 

    
    public SignUpController(UsersRepo acctRepo, UsersRoleRepo roleRepo, 
            PasswordEncoder passwordEncoder, TokenManager tokenMgr) {
this.acctRepo = acctRepo;
this.roleRepo = roleRepo;
this.passwordEncoder = passwordEncoder;
this.tokenMgr = tokenMgr;
}    

    @PostMapping("/signup/user")
    public ResponseEntity<String> createUserAccount(@RequestBody Users newAcct) {
        try {

        	if (acctRepo.findByUsername(newAcct.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Username is already taken");
            }

            String normalizedPhone = normalizePhoneNumber(newAcct.getPhone());
            if (acctRepo.existsByPhone(normalizedPhone)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Phone number is already registered");
            }

            if (!validateUserInput(newAcct)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing or invalid required fields");
            }

            Users acct = Users.builder()
                .username(newAcct.getUsername())
                .firstName(newAcct.getFirstName())
                .lastName(newAcct.getLastName())
                .phone(normalizedPhone)
                .email(newAcct.getEmail())
                .address(newAcct.getAddress())
                .startDate(Date.valueOf(LocalDate.now()))
                .active(true)
                .build();

            UsersRole role = roleRepo.findByRoleName(UsersRole.RoleName.REGISTEREDUSER)
                .orElseThrow(() -> new RuntimeException("REGISTEREDUSER role not found"));
            acct.setRole(role);

            acctRepo.save(acct);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Successfully registered as REGISTEREDUSER");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("User registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/signup/admin")
    public ResponseEntity<String> createAdminAccount(@RequestBody Users newAcct) {
        try {
            if (acctRepo.findByUsername(newAcct.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Username is already taken");
            }

            String normalizedPhone = normalizePhoneNumber(newAcct.getPhone());
            if (acctRepo.existsByPhone(normalizedPhone)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Phone number is already registered");
            }

            if (!validateAdminInput(newAcct)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Missing or invalid required fields (including password)");
            }

            Users acct = Users.builder()
                .username(newAcct.getUsername())
                .firstName(newAcct.getFirstName())
                .lastName(newAcct.getLastName())
                .phone(normalizedPhone)
                .email(newAcct.getEmail())
                .address(newAcct.getAddress())
                .startDate(Date.valueOf(LocalDate.now()))
                .active(true)
                .password(passwordEncoder.encode(newAcct.getPassword())) 
                .build();

            UsersRole role = roleRepo.findByRoleName(UsersRole.RoleName.ADMIN)
                .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
            acct.setRole(role);

            acctRepo.save(acct);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Successfully registered as ADMIN. Use username/password to login.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Admin registration failed: " + e.getMessage());
        }
    }

    private String normalizePhoneNumber(String phone) {
        if (phone == null) {
            throw new RuntimeException("Phone number is required");
        }
        String cleanedPhone = phone.replaceAll("[^0-9+]", "");
        return cleanedPhone.startsWith("+") ? cleanedPhone : "+91" + cleanedPhone;
    }

    private boolean validateUserInput(Users acct) {
        return acct.getUsername() != null && !acct.getUsername().trim().isEmpty() &&
                acct.getFirstName() != null && !acct.getFirstName().trim().isEmpty() &&
                acct.getLastName() != null && !acct.getLastName().trim().isEmpty() &&
                acct.getPhone() != null && !acct.getPhone().trim().isEmpty() &&
                acct.getEmail() != null && isValidEmail(acct.getEmail())&&
                acct.getAddress() !=null && !acct.getAddress().trim().isEmpty();
    }

    private boolean validateAdminInput(Users acct) {
        return acct.getUsername() != null && !acct.getUsername().trim().isEmpty() &&
                acct.getFirstName() != null && !acct.getFirstName().trim().isEmpty() &&
                acct.getLastName() != null && !acct.getLastName().trim().isEmpty() &&
                acct.getPhone() != null && !acct.getPhone().trim().isEmpty() &&
                acct.getEmail() != null && isValidEmail(acct.getEmail()) &&
                acct.getPassword() != null && !acct.getPassword().trim().isEmpty();
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }
    
    @GetMapping("/registered-users")
    public ResponseEntity<List<Users>> getAllRegisteredUsers() {
        List<Users> users = acctRepo.findAllRegisteredUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/toggle-status/{userId}")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long userId) {
        try {
            Users user = acctRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setActive(!user.isActive());
            acctRepo.save(user);
            return ResponseEntity.ok("User status toggled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to toggle user status: " + e.getMessage());
        }
    }
    
 // In SignUpController.java, add this new method:
    @PutMapping("/update-password")
    public ResponseEntity<String> updateAdminPassword(@RequestHeader("Authorization") String authHeader, 
                                                     @RequestBody Map<String, String> request) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Invalid or missing Authorization header");
            }
            String token = authHeader.substring(7);
            String username = tokenMgr.getUsernameFromToken(token);
            
            Users admin = acctRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
                
            if (admin.getRole().getRoleName() != UsersRole.RoleName.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not an admin account");
            }

            String newPassword = request.get("password");
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password cannot be empty");
            }

            admin.setPassword(passwordEncoder.encode(newPassword));
            acctRepo.save(admin);
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to update password: " + e.getMessage());
        }
    }
    
 // In SignUpController.java
    @GetMapping("/user-profile")
    public ResponseEntity<Users> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(null);
            }
            String token = authHeader.substring(7);
            String username = tokenMgr.getUsernameFromToken(token);
            
            Users user = acctRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            if (user.getRole().getRoleName() != UsersRole.RoleName.REGISTEREDUSER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Update the existing profile update endpoint to be user-specific
    @PutMapping("/user-profile")
    public ResponseEntity<String> updateUserProfile(@RequestHeader("Authorization") String authHeader, 
                                                   @RequestBody Users updatedUser) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Invalid or missing Authorization header");
            }
            String token = authHeader.substring(7);
            String username = tokenMgr.getUsernameFromToken(token);
            
            Users user = acctRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            if (user.getRole().getRoleName() != UsersRole.RoleName.REGISTEREDUSER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not a user account");
            }

            // Update only editable fields
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setAddress(updatedUser.getAddress());
            user.setEmail(updatedUser.getEmail());

            // Validate updated fields
            if (!validateUserInput(user)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid input data");
            }

            acctRepo.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to update profile: " + e.getMessage());
        }
    }
    
}