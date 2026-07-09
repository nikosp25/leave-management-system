package com.example.leave_management_system.controller;


import com.example.leave_management_system.dto.AuthenticationRequestDTO;
import com.example.leave_management_system.dto.AuthenticationResponseDTO;
import com.example.leave_management_system.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(
            @Valid @RequestBody AuthenticationRequestDTO request,
            HttpServletResponse response
    ) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        UserDetails user = userDetailsService.loadUserByUsername(request.email());

        String jwt = jwtService.generateToken(user);

        Cookie jwtCookie = new Cookie("jwt_token", jwt);
        jwtCookie.setHttpOnly(true); // CRITICAL: Frontend JavaScript cannot read the cookie.
        jwtCookie.setSecure(false);  // Note: Set to 'true' later when i need HTTPS in production.
        jwtCookie.setPath("/");      // Cookie is valid for the entire API
        jwtCookie.setMaxAge(15 * 60); // 15 minutes (in seconds)

        response.addCookie(jwtCookie);

        return ResponseEntity.ok(new AuthenticationResponseDTO(
                "Login successful",
                user.getUsername()
        ));
    }
}





