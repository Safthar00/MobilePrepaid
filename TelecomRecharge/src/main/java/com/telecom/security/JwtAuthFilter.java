package com.telecom.security;

import com.telecom.service.UsersSecurityService;
import com.telecom.service.TokenBlacklistService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final TokenManager tokenMgr;
    private final UsersSecurityService acctService;
    private final TokenBlacklistService blacklistService;

    public JwtAuthFilter(TokenManager tokenMgr, UsersSecurityService acctService, TokenBlacklistService blacklistService) {
        this.tokenMgr = tokenMgr;
        this.acctService = acctService;
        this.blacklistService = blacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        String token = null;
        String user = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            if (blacklistService.isTokenBlacklisted(token)) {
                chain.doFilter(req, res); 
                return;
            }
            user = tokenMgr.getUsernameFromToken(token);
        }

        if (user != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails details = acctService.loadUserByUsername(user);
            if (tokenMgr.checkToken(token, details)) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        details, null, details.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);
    }
}