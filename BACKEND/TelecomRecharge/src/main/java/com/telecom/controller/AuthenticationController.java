package com.telecom.controller;

import com.telecom.model.Users;
import com.telecom.model.UsersRole;
import com.telecom.model.Login;
import com.telecom.model.Token;
import com.telecom.repository.UsersRepo;
import com.telecom.security.TokenManager;
import com.telecom.service.UsersSecurityService;
import com.twilio.exception.AuthenticationException;
import com.telecom.service.OtpService;
import com.telecom.service.TokenBlacklistService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://127.0.0.1:5503,http://127.0.0.1:5504")
public class AuthenticationController {
    private final AuthenticationManager authMgr;
    private final TokenManager tokenMgr;
    private final UsersRepo acctRepo;
    private final UsersSecurityService acctService;
    private final TokenBlacklistService blacklistService;
    private final OtpService otpService;

    public AuthenticationController(AuthenticationManager authMgr, TokenManager tokenMgr,
                                    UsersRepo acctRepo, UsersSecurityService acctService,
                                    TokenBlacklistService blacklistService, OtpService otpService) {
        this.authMgr = authMgr;
        this.tokenMgr = tokenMgr;
        this.acctRepo = acctRepo;
        this.acctService = acctService;
        this.blacklistService = blacklistService;
        this.otpService = otpService;
    }

    @PostMapping("/login/admin")
    public ResponseEntity<?> processAdminLogin(@RequestBody Login request) {
        try {
            authMgr.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            Users acct = acctRepo.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (acct.getRole().getRoleName() != UsersRole.RoleName.ADMIN) {
                throw new RuntimeException("Not an admin account");
            }

            UserDetails details = acctService.loadUserByUsername(request.getUsername());
            String mainToken = tokenMgr.generateToken(details.getUsername(), List.of("ADMIN"));
            String refToken = tokenMgr.generateRefreshToken(details.getUsername(), List.of("ADMIN"));
            return ResponseEntity.ok(new Token(mainToken, refToken, "ADMIN"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login/user")
    public ResponseEntity<String> requestUserLogin(@RequestBody Map<String, String> requestBody) {
        String phone = requestBody.get("phone");
        if (phone == null || phone.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Phone number is required");
        }
        String normalizedPhone = phone.startsWith("+") ? phone : "+91" + phone;
        Users acct = acctRepo.findByPhone(normalizedPhone)
                .orElse(null);
        if (acct == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Phone number not registered: " + normalizedPhone);
        }
        if (!acct.isActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Account not activated");
        }
        otpService.generateOtp(normalizedPhone);
        return ResponseEntity.ok("OTP sent to " + normalizedPhone);
    }

    @PostMapping("/login/user/verify")
    public ResponseEntity<?> verifyUserLogin(@RequestBody Map<String, String> requestBody) {
        String phone = requestBody.get("phone");
        String otp = requestBody.get("otp");
        if (phone == null || otp == null || phone.trim().isEmpty() || otp.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Phone and OTP are required");
        }

        String normalizedPhone = phone.startsWith("+") ? phone : "+91" + phone;
        if (!otpService.validateOtp(normalizedPhone, otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP");
        }

        Users acct = acctRepo.findByPhone(normalizedPhone)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        UserDetails details = acctService.loadUserByUsername(acct.getUsername());
        String mainToken = tokenMgr.generateToken(acct.getUsername(), List.of("USER"));
        String refToken = tokenMgr.generateRefreshToken(acct.getUsername(), List.of("USER"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", mainToken);
        response.put("refreshToken", refToken);
        response.put("role", "USER");
        response.put("username", acct.getUsername());
        response.put("userId", acct.getUserId());

        System.out.println("Login response: " + response);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> processLogout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Invalid or missing Authorization header");
        }
        String token = authHeader.substring(7);
        blacklistService.blacklistToken(token);
        return ResponseEntity.ok("Logged out successfully");
    }
    
 // In AuthenticationController.java, add this new method:
    @GetMapping("/profile")
    public ResponseEntity<Users> getAdminProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(null);
            }
            String token = authHeader.substring(7);
            String username = tokenMgr.getUsernameFromToken(token);
            
            if (blacklistService.isTokenBlacklisted(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            
            Users admin = acctRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
                
            if (admin.getRole().getRoleName() != UsersRole.RoleName.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
 
}