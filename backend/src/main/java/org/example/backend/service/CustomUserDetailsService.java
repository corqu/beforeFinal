package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.config.CustomUserDetails;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginId) throws UsernameNotFoundException {
        User user = userRepository.findByLoginId(loginId).orElseThrow(() -> new UsernameNotFoundException(loginId));
        return new CustomUserDetails(user);
    }
}
