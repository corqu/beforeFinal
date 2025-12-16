'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, isGuest, isLoading, enterAsGuest } = useAuth();

  useEffect(() => {
    // 이미 로그인했거나 게스트인 경우 퀴즈 페이지로 이동
    if (!isLoading && (user || isGuest)) {
      router.push('/quiz');
    }
  }, [user, isGuest, isLoading, router]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleGuest = () => {
    enterAsGuest();
    router.push('/quiz');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="text-4xl mb-4">🧠</div>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="card max-w-md w-full animate-scaleIn text-center">
        {/* 로고 및 타이틀 */}
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            🧠
          </div>
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Quiz Master
          </h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            지식을 테스트해보세요!
          </p>
        </div>

        {/* 선택 버튼들 */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="btn-primary w-full"
          >
            로그인하기
          </button>
          
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }}></div>
            <span style={{ color: 'var(--foreground)', opacity: 0.5, fontSize: '0.875rem' }}>또는</span>
            <div className="flex-1 h-px" style={{ background: 'var(--card-border)' }}></div>
          </div>

          <button
            onClick={handleGuest}
            className="btn-secondary w-full"
          >
            게스트로 시작하기
          </button>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--card-border)' }}>
          <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
            계정이 없으신가요?{' '}
            <button 
              onClick={() => router.push('/register')}
              className="underline hover:no-underline transition-all"
              style={{ color: 'var(--primary)' }}
            >
              회원가입
            </button>
          </p>
        </div>
      </div>

      {/* 하단 장식 */}
      <div className="mt-8 text-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.4 }}>
          다양한 퀴즈로 실력을 향상시켜보세요 ✨
        </p>
      </div>
    </div>
  );
}
