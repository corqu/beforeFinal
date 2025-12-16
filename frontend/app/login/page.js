'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isGuest, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (user || isGuest)) {
      router.push('/quiz');
    }
  }, [user, isGuest, isLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      router.push('/quiz');
    } else {
      setError(result.message);
    }
    
    setIsSubmitting(false);
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
    <div className="min-h-screen">
      <Header />
      
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="card max-w-md w-full animate-scaleIn">
          {/* 타이틀 */}
          <div className="text-center mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--primary)' }}
            >
              로그인
            </h1>
            <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              계정에 로그인하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--foreground)', opacity: 0.8 }}
              >
                아이디
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--foreground)', opacity: 0.8 }}
              >
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 링크들 */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
              계정이 없으신가요?{' '}
              <button 
                onClick={() => router.push('/register')}
                className="underline hover:no-underline transition-all"
                style={{ color: 'var(--primary)' }}
              >
                회원가입
              </button>
            </p>
            <p className="text-sm">
              <button 
                onClick={() => router.push('/')}
                className="hover:underline transition-all"
                style={{ color: 'var(--foreground)', opacity: 0.5 }}
              >
                ← 돌아가기
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

