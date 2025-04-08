package com.telecom.service;

import com.telecom.model.Users;
import com.telecom.repository.UsersRepo;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UsersSecurityService implements UserDetailsService {
    private final UsersRepo acctRepo;

    public UsersSecurityService(UsersRepo acctRepo) {
        this.acctRepo = acctRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users acct = acctRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user found: " + username));

        if (acct.getRole() == null) {
            throw new IllegalStateException("User has no role assigned");
        }

        return new org.springframework.security.core.userdetails.User(
                acct.getUsername(),
                acct.getPassword() != null ? acct.getPassword() : "{noop}TEMP_PASSWORD",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + acct.getRole().getRoleName()))
        );
    }
}