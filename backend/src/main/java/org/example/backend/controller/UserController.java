package org.example.backend.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.config.CustomUserDetails;
import org.example.backend.dto.userdto.UserAfterRegisterDto;
import org.example.backend.dto.userdto.UserInfoDto;
import org.example.backend.dto.userdto.UserRegisterDto;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/info")
    public ResponseEntity<UserInfoDto> info(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        if (customUserDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long id = customUserDetails.getId();

        UserInfoDto userInfo = userService.getUserInfo(id);
        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/register")
    public ResponseEntity<UserAfterRegisterDto> register(@RequestBody UserRegisterDto userDto, HttpServletRequest request){
        UserAfterRegisterDto dto = userService.registerUser(userDto);
        return ResponseEntity.ok(dto);
    }



}
