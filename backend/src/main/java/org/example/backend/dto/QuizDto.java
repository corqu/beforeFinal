package org.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.example.backend.entity.Quiz;

@Getter @Setter
public class QuizDto {
    private Long id;
    private String title;
    @NotBlank(message = "문제를 입력하세요")
    private String description;
    @NotBlank(message = "정답을 입력하세요")
    private String answer;

    public QuizDto(Long id, String title, String description, String answer) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.answer = answer;
    }

    public static QuizDto quiz4Dto(Quiz quiz) {
        return new QuizDto(quiz.getId(), quiz.getTitle(), quiz.getDescription(), quiz.getAnswer());
    }
}
