package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.QuizDto;
import org.example.backend.entity.Quiz;
import org.example.backend.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizRepository quizRepository;

    public List<QuizDto> getQuizzes(int number) {
        List<Quiz> quizzes = quizRepository.findRandomQuizzes(number);
        return quizzes.stream().map(QuizDto::quiz4Dto).collect(Collectors.toList());
    }

    // 추가
    public QuizDto addQuiz(QuizDto quizDto) {
        Quiz quiz = new Quiz(quizDto.getId(), quizDto.getTitle(), quizDto.getDescription(), quizDto.getAnswer());
        Quiz saved = quizRepository.save(quiz);
        return QuizDto.quiz4Dto(saved);
    }

    // 수정
    public QuizDto updateQuiz(QuizDto quizDto) {
        Quiz quiz = quizRepository.findById(quizDto.getId()).orElse(null);
        quiz.setTitle(quizDto.getTitle());
        quiz.setDescription(quizDto.getDescription());
        quiz.setAnswer(quizDto.getAnswer());
        Quiz saved = quizRepository.save(quiz);
        return QuizDto.quiz4Dto(saved);
    }

    // 삭제
    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }
}
