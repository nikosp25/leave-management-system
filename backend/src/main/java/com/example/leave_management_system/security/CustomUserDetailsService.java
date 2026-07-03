package com.example.leave_management_system.security;

import com.example.leave_management_system.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        return userRepository.findByEmailAndDeletedFalse(email)
                .map(user -> new CustomUserDetails(user))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}




