"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  console.log(baseURL);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 복원
    const savedUser = localStorage.getItem("user");
    const savedIsGuest = localStorage.getItem("isGuest");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedIsGuest === "true") {
      setIsGuest(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: `username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
      });

      if (response.ok) {
        const userData = { loginId: username, isLoggedIn: true };
        setUser(userData);
        setIsGuest(false);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.removeItem("isGuest");
        return { success: true };
      } else {
        return {
          success: false,
          message: "로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.",
        };
      }
    } catch (error) {
      return { success: false, message: "서버 연결에 실패했습니다." };
    }
  };

  const register = async (loginId, password, nickname) => {
    try {
      const response = await fetch(`${baseURL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginId, password, nickname }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json().catch(() => ({}));
        return {
          success: false,
          message: data.message || "회원가입에 실패했습니다.",
        };
      }
    } catch (error) {
      return { success: false, message: "서버 연결에 실패했습니다." };
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isGuest");
  };

  const enterAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    localStorage.setItem("isGuest", "true");
    localStorage.removeItem("user");
  };

  const getUserInfo = async () => {
    if (!user) return null;

    try {
      const response = await fetch(
        `${baseURL}/api/users/info/${user.id || 0}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const isAuthenticated = () => {
    return user !== null || isGuest;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isLoading,
        login,
        register,
        logout,
        enterAsGuest,
        getUserInfo,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
