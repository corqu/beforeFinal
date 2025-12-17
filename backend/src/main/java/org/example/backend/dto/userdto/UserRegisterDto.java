package org.example.backend.dto.userdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

@Getter
public class UserRegisterDto {
    @NotBlank
    private String loginId;

    @NotBlank
    @Size(min = 5, max = 10)
    private String password;

    @NotBlank
    private String nickname;

    public UserRegisterDto(String loginId, String password, String nickname) {
        this.loginId = loginId;
        this.password = password;
        this.nickname = nickname;
    }
}
