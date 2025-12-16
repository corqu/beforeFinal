package org.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionController {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {

        // 에러 메시지가 "not enough quizzes"라면 400(Bad Request)로 바꿔서 보냄
        if (e.getMessage().contains("not enough")) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "문제가 부족합니다! 숫자를 줄여주세요.");

            // 500(서버고장) 대신 400(요청오류)을 리턴
            return ResponseEntity.badRequest().body(errorResponse);
        }

        // 그 외 진짜 서버 에러는 500으로 보냄
        return ResponseEntity.internalServerError().build();
    }
}
