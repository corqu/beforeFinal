package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.QuizDto;
import org.example.backend.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @GetMapping
    public ResponseEntity<List<QuizDto>> getAllQuizzes(@RequestParam int size) {
        List<QuizDto> quizzes = quizService.getQuizzes(size);
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping
    public ResponseEntity<QuizDto> saveQuiz(@RequestBody QuizDto quizDto) {
        QuizDto addQuiz = quizService.addQuiz(quizDto);
        return ResponseEntity.ok(addQuiz);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuiz(@RequestBody QuizDto quizDto) {
        quizService.deleteQuiz(quizDto.getId());
    }
}
