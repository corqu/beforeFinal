'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, isGuest, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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

  const validateForm = () => {
    if (formData.password.length < 5 || formData.password.length > 10) {
      setError('비밀번호는 5자 이상 10자 이하로 입력하세요.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');

    const result = await register(formData.loginId, formData.password, formData.nickname);
    
    if (result.success) {
      setSuccess('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
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
      
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
        <div className="card max-w-md w-full animate-scaleIn">
          {/* 타이틀 */}
          <div className="text-center mb-8">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--primary)' }}
            >
              회원가입
            </h1>
            <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              새 계정을 만들어보세요
            </p>
          </div>

          {/* 에러/성공 메시지 */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* 회원가입 폼 */}
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
                name="loginId"
                value={formData.loginId}
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
                닉네임
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="input"
                placeholder="닉네임을 입력하세요"
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
                placeholder="비밀번호 (5~10자)"
                required
              />
              <p className="text-xs mt-1" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
                5자 이상 10자 이하로 입력하세요
              </p>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--foreground)', opacity: 0.8 }}
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6"
              disabled={isSubmitting || success}
            >
              {isSubmitting ? '가입 중...' : '회원가입'}
            </button>
          </form>

          {/* 링크들 */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
              이미 계정이 있으신가요?{' '}
              <button 
                onClick={() => router.push('/login')}
                className="underline hover:no-underline transition-all"
                style={{ color: 'var(--primary)' }}
              >
                로그인
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

