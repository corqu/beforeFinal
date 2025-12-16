package org.example.backend.dto.userdto;

import lombok.Getter;

@Getter
public class UserInfoDto {
    private Long id;
    private String nickname;
    private Long score;

    public UserInfoDto(Long id, String nickname, Long score) {
        this.id = id;
        this.nickname = nickname;
        this.score = score;
    }
}
