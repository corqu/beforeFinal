'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isGuest, logout, getUserInfo } = useAuth();
  const router = useRouter();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleShowInfo = async () => {
    if (showUserInfo) {
      setShowUserInfo(false);
      return;
    }
    
    setIsLoadingInfo(true);
    const info = await getUserInfo();
    setUserInfo(info);
    setShowUserInfo(true);
    setIsLoadingInfo(false);
  };

  const handleGoHome = () => {
    router.push('/quiz');
  };

  if (isGuest) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={handleGoHome}
            className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer"
            style={{ color: 'var(--primary)' }}
          >
            🧠 Quiz Master
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm px-3 py-1 rounded-full" style={{ 
              background: 'rgba(255, 204, 0, 0.15)', 
              color: 'var(--secondary)',
              border: '1px solid var(--secondary)'
            }}>
              게스트 모드
            </span>
            <button
              onClick={handleLogout}
              className="btn-ghost text-sm"
            >
              나가기
            </button>
          </div>
        </div>
      </header>
    );
  }

  if (!user) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span 
            className="text-2xl font-bold cursor-pointer"
            style={{ color: 'var(--primary)' }}
            onClick={() => router.push('/')}
          >
            🧠 Quiz Master
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <button
          onClick={handleGoHome}
          className="text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer"
          style={{ color: 'var(--primary)' }}
        >
          🧠 Quiz Master
        </button>
        <div className="flex items-center gap-4 relative">
          <span className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            안녕하세요, <strong style={{ color: 'var(--primary)' }}>{user.loginId}</strong>님
          </span>
          <button
            onClick={handleShowInfo}
            className="btn-ghost text-sm"
            disabled={isLoadingInfo}
          >
            {isLoadingInfo ? '로딩...' : '정보보기'}
          </button>
          <button
            onClick={handleLogout}
            className="btn-ghost text-sm"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            로그아웃
          </button>

          {/* 사용자 정보 모달 */}
          {showUserInfo && (
            <div 
              className="absolute top-12 right-0 card animate-scaleIn"
              style={{ 
                minWidth: '280px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)'
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                  내 정보
                </h3>
                <button 
                  onClick={() => setShowUserInfo(false)}
                  className="text-xl hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--foreground)' }}
                >
                  ×
                </button>
              </div>
              {userInfo ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.7 }}>닉네임</span>
                    <span style={{ color: 'var(--foreground)' }}>{userInfo.nickname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ opacity: 0.7 }}>점수</span>
                    <span style={{ color: 'var(--secondary)' }}>{userInfo.score || 0}점</span>
                  </div>
                </div>
              ) : (
                <p style={{ opacity: 0.7, textAlign: 'center' }}>
                  정보를 불러올 수 없습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

