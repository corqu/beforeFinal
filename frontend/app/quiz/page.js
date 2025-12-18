"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

export default function QuizPage() {
  const router = useRouter();
  const { user, isGuest, isLoading } = useAuth();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  // 상태 관리
  const [quizCount, setQuizCount] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null); // 'correct' | 'wrong' | null

  // 페이지 상태: 'input' | 'quiz' | 'complete'
  const [pageState, setPageState] = useState("input");

  useEffect(() => {
    if (!isLoading && !user && !isGuest) {
      router.push("/");
    }
  }, [user, isGuest, isLoading, router]);

  const fetchQuizzes = async () => {
    const count = parseInt(quizCount);
    if (!count || count < 1) {
      setError("1개 이상의 퀴즈 개수를 입력하세요.");
      return;
    }

    setIsLoadingQuiz(true);
    setError("");

    try {
      const response = await fetch(`${baseURL}/api/quizzes?size=${count}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
        setCurrentIndex(0);
        setResults([]);
        setUserAnswer("");
        setPageState("quiz");
      } else {
        // 에러 응답 처리
        const errorData = await response.json();
        if (errorData.message) {
          setError(errorData.message);
        } else {
          setError("퀴즈를 불러오는데 실패했습니다.");
        }
      }
    } catch (err) {
      setError(
        "서버 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인하세요."
      );
    }

    setIsLoadingQuiz(false);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;

    const currentQuiz = quizzes[currentIndex];
    const isCorrect =
      userAnswer.trim().toLowerCase() === currentQuiz.answer.toLowerCase();

    // 피드백 표시
    setAnswerFeedback(isCorrect ? "correct" : "wrong");

    // 결과 저장
    setResults((prev) => [
      ...prev,
      {
        question: currentQuiz.description,
        userAnswer: userAnswer.trim(),
        correctAnswer: currentQuiz.answer,
        isCorrect,
      },
    ]);

    // 1.5초 후 다음 문제로
    setTimeout(() => {
      setAnswerFeedback(null);
      setUserAnswer("");

      if (currentIndex < quizzes.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setPageState("complete");
        setShowResult(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setQuizCount("");
    setQuizzes([]);
    setCurrentIndex(0);
    setUserAnswer("");
    setResults([]);
    setError("");
    setShowResult(false);
    setPageState("input");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (pageState === "input") {
        fetchQuizzes();
      } else if (pageState === "quiz" && !answerFeedback) {
        handleSubmitAnswer();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="text-4xl mb-4">🧠</div>
          <p style={{ color: "var(--foreground)", opacity: 0.7 }}>로딩 중...</p>
        </div>
      </div>
    );
  }

  // 퀴즈 개수 입력 화면
  if (pageState === "input") {
    return (
      <div className="min-h-screen">
        <Header />

        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="card max-w-lg w-full animate-scaleIn text-center">
            {/* 타이틀 */}
            <div className="mb-8">
              <div className="text-5xl mb-4">📝</div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--primary)" }}
              >
                퀴즈 시작하기
              </h1>
              <p style={{ color: "var(--foreground)", opacity: 0.7 }}>
                풀고 싶은 퀴즈 개수를 입력하세요
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {/* 입력 폼 */}
            <div className="space-y-6">
              <div>
                <input
                  type="number"
                  value={quizCount}
                  onChange={(e) => {
                    setQuizCount(e.target.value);
                    setError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="input text-center text-2xl"
                  placeholder="예: 5"
                  min="1"
                  style={{
                    fontSize: "1.5rem",
                    letterSpacing: "0.1em",
                  }}
                />
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--foreground)", opacity: 0.5 }}
                >
                  1개 이상의 숫자를 입력하세요
                </p>
              </div>

              <button
                onClick={fetchQuizzes}
                className="btn-primary w-full"
                disabled={isLoadingQuiz}
              >
                {isLoadingQuiz ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> 퀴즈 불러오는 중...
                  </span>
                ) : (
                  "퀴즈 시작! 🚀"
                )}
              </button>
            </div>

            {/* 힌트 */}
            <div
              className="mt-8 pt-6"
              style={{ borderTop: "1px solid var(--card-border)" }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--foreground)", opacity: 0.4 }}
              >
                💡 Enter 키를 눌러도 시작할 수 있어요
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 퀴즈 풀기 화면
  if (pageState === "quiz") {
    const currentQuiz = quizzes[currentIndex];
    const progress = ((currentIndex + 1) / quizzes.length) * 100;

    return (
      <div className="min-h-screen">
        <Header />

        <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
          <div className="card max-w-2xl w-full animate-scaleIn">
            {/* 진행 상황 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-sm"
                  style={{ color: "var(--foreground)", opacity: 0.7 }}
                >
                  진행률
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  {currentIndex + 1} / {quizzes.length}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* 퀴즈 번호 및 제목 */}
            <div className="mb-6">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                style={{
                  background: "rgba(0, 217, 255, 0.15)",
                  color: "var(--primary)",
                }}
              >
                Q{currentIndex + 1}
              </span>
              {currentQuiz.title && (
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: "var(--secondary)" }}
                >
                  {currentQuiz.title}
                </h2>
              )}
            </div>

            {/* 문제 */}
            <div
              className="p-6 rounded-xl mb-6"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--card-border)",
              }}
            >
              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                {currentQuiz.description}
              </p>
            </div>

            {/* 답변 피드백 */}
            {answerFeedback && (
              <div
                className={`alert ${
                  answerFeedback === "correct" ? "alert-success" : "alert-error"
                }`}
                style={{ textAlign: "center", fontSize: "1.1rem" }}
              >
                {answerFeedback === "correct" ? (
                  <span>✅ 정답입니다!</span>
                ) : (
                  <span>
                    ❌ 틀렸습니다! 정답: <strong>{currentQuiz.answer}</strong>
                  </span>
                )}
              </div>
            )}

            {/* 답변 입력 */}
            {!answerFeedback && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input text-lg"
                  placeholder="정답을 입력하세요..."
                  autoFocus
                />
                <button
                  onClick={handleSubmitAnswer}
                  className="btn-primary w-full"
                  disabled={!userAnswer.trim()}
                >
                  제출하기
                </button>
              </div>
            )}

            {/* 포기 버튼 */}
            <div className="mt-6 text-center">
              <button
                onClick={handleRestart}
                className="text-sm hover:underline transition-all"
                style={{ color: "var(--foreground)", opacity: 0.5 }}
              >
                ⏪ 처음으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (pageState === "complete") {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalCount = results.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    return (
      <div className="min-h-screen">
        <Header />

        <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
          <div className="card max-w-2xl w-full animate-scaleIn">
            {/* 결과 요약 */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? "🏆" : percentage >= 50 ? "👍" : "💪"}
              </div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: "var(--primary)" }}
              >
                퀴즈 완료!
              </h1>
              <div
                className="text-5xl font-bold my-6"
                style={{
                  background: `linear-gradient(135deg, ${
                    percentage >= 50 ? "var(--success)" : "var(--accent)"
                  }, var(--secondary))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {correctCount} / {totalCount}
              </div>
              <p style={{ color: "var(--foreground)", opacity: 0.7 }}>
                정답률: {percentage}%
              </p>
            </div>

            {/* 결과 상세 */}
            <div
              className="max-h-80 overflow-y-auto mb-6 space-y-3"
              style={{
                padding: "1rem",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "12px",
                border: "1px solid var(--card-border)",
              }}
            >
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{
                    background: result.isCorrect
                      ? "rgba(0, 255, 136, 0.1)"
                      : "rgba(255, 71, 87, 0.1)",
                    border: `1px solid ${
                      result.isCorrect ? "var(--success)" : "var(--error)"
                    }`,
                    borderLeftWidth: "4px",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">
                      {result.isCorrect ? "✅" : "❌"}
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-sm mb-2"
                        style={{ color: "var(--foreground)", opacity: 0.8 }}
                      >
                        Q{index + 1}. {result.question}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>
                          <span style={{ opacity: 0.6 }}>내 답변: </span>
                          <span
                            style={{
                              color: result.isCorrect
                                ? "var(--success)"
                                : "var(--error)",
                            }}
                          >
                            {result.userAnswer}
                          </span>
                        </span>
                        {!result.isCorrect && (
                          <span>
                            <span style={{ opacity: 0.6 }}>정답: </span>
                            <span style={{ color: "var(--success)" }}>
                              {result.correctAnswer}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 다시하기 버튼 */}
            <div className="flex gap-4">
              <button onClick={handleRestart} className="btn-secondary flex-1">
                다시 풀기
              </button>
              <button
                onClick={() => router.push("/")}
                className="btn-ghost flex-1"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
