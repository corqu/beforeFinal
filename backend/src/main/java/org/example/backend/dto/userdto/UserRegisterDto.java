package org.example.backend.dto.userdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class UserRegisterDto {
    @NotBlank
    private String loginId;

    @NotBlank
    @Size(min = 5, max = 10)
    private String password;

    @NotBlank
    private String nickname;
}
