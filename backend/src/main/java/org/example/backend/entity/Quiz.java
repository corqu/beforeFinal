package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "quizzes")
@Getter
@Setter
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String answer;

    public Quiz(Long id, String title, String description, String answer) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.answer = answer;
    }

    public Quiz() {

    }
}
