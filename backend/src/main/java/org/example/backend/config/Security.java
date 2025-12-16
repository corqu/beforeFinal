package org.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.Collections;

@Component
public class Security {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth->auth
                        .requestMatchers("/login", "/api/users/*", "/", "/api/quizzes/**").permitAll()
                        .requestMatchers("/info").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated());

        http
                .cors(cors->cors.configurationSource(request ->{
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
                    config.setAllowedMethods(Collections.singletonList("*"));
                    config.setAllowedHeaders(Collections.singletonList("*"));
                    config.setAllowCredentials(true);
                    return config;
                }));
        http
                .csrf(csrf -> csrf.disable());
        http
                .formLogin(login -> login
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .defaultSuccessUrl("/api/quizzes")
                        .permitAll());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
