'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.email) {
            setUserData(data);
          } else {
            setUserData(null);
            localStorage.removeItem('token');
          }
        })
        .catch(() => {
          setUserData(null);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        if (data.user && data.user.email) {
          setUserData(data.user);
        }
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUserData(null);
  };

  // Create a safe user object that only contains what we need
  const user = userData ? {
    email: userData.email || ''
  } : null;

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 