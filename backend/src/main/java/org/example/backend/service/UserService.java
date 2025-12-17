package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.userdto.UserAfterRegisterDto;
import org.example.backend.dto.userdto.UserInfoDto;
import org.example.backend.dto.userdto.UserRegisterDto;
import org.example.backend.entity.User;
import org.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 유저 정보 반환
    public UserInfoDto getUserInfo(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("해당 유저 없슴"));
        return new UserInfoDto(user.getId(), user.getNickname(), user.getScore());
    }

    // 회원가입
    public UserAfterRegisterDto registerUser(UserRegisterDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        User user = new User(userDto.getLoginId(), encodedPassword, userDto.getNickname());
        User saved = userRepository.save(user);
        return new UserAfterRegisterDto(saved.getId(), saved.getLoginId(), saved.getNickname());
    }
}
