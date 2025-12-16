package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.userdto.UserInfoDto;
import org.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/info/{id}")
    public ResponseEntity<UserInfoDto> info(@PathVariable Long id){
        UserInfoDto userInfo = userService.getUserInfo(id);
        return ResponseEntity.ok(userInfo);
    }


}
