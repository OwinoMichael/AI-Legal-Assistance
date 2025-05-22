package com.legal.demo.application.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JWTAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //token will be sent in header
        //Bearer [jwt]

        String authHeader = request.getHeader("Authorization");
        String token = null;

        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7); //Cuts of Bearer and space
        }

        //validate token
        if(token != null && JWTUtil.validateToken(token)){
            String username = JWTUtil.extractUsername(token);

            //put our validated username into our security context holder
            Authentication auth = new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
