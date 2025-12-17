# API 명세서

## 퀴즈 관련 API

### 1. 지정 개수 퀴즈 조회
```angular2html
| 항 목 | 내 용 | 
|-------|------|
| U R L | GET /api/quizzes?size=10 |
| Request | 없음 (Query Param 사용: `size`) |
| Response | `[{ id, title, description, answer}, ...]`
```

### 2. 퀴즈 저장하기
```angular2html
| 항 목 | 내 용 | 
|-------|------|
| U R L | POST /api/quizzes |
| Request | `{ title, description, answer}` |
| Response | `{ id, title, description, answer}` |
```

### 3. 퀴즈 삭제하기
```angular2html
| 항 목 | 내 용 | 
|-------|------|
| U R L | DELETE /api/quizzes/{id} |
| Request | 없음 |
| Response | HTTP 204 No Content |
```

## 유저 관련 API

### 1. 유저 정보 조회
```angular2html
| 항 목 | 내 용 | 
|-------|------|
| U R L | GET /api/users/info/ |
| Request | 없음 (Header: Authorization 토큰) |
| Response | `{ id, nickname, score } `|
```

### 2. 회원 가입
```angular2html
| 항 목 | 내 용 |
|-------|------|
| U R L | POST /api/users/register |
| Request | `{ loginId, password, nickname }` |
| Response | `{ id, loginId, nickname }` |
```
### 3. 로그인
```angular2html
| 항 목 | 내 용 |
|-------|------|
| U R L | POST /login |
| Request | `{ loginId, password }` |
| Response | 없음 |
```
 