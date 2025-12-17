package org.example.backend.dto.userdto;

import lombok.Getter;

@Getter
public class UserAfterRegisterDto {
    private Long id;
    private String loginId;
    private String nickname;

    public UserAfterRegisterDto(Long id, String loginId, String nickname) {
        this.id = id;
        this.loginId = loginId;
        this.nickname = nickname;
    }
}
