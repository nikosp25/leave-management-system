package com.example.leave_management_system.security;

import com.example.leave_management_system.model.Capability;
import com.example.leave_management_system.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails  {
    private final User user;

    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Add the Role
        String roleName = user.getRole().getName().trim().toUpperCase().replace(" ", "_");
        authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));

        // Add the Capabilities
        for (Capability capability : user.getRole().getCapabilities()) {
            String capabilityName = capability.getName().trim().toUpperCase().replace(" ", "_");
            authorities.add(new SimpleGrantedAuthority(capabilityName));
        }

        return authorities;
    }



    @Override
    public String getPassword() {
        return user.getPassword(); // This returns the BCrypt hashed password
    }

    @Override
    public String getUsername() {
        return user.getEmail(); //email as username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.isDeleted(); // Soft-deleted users are locked out
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !user.isDeleted(); // Only active users are enabled
    }
}
