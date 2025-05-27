import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Intenta cargar usuario y token de localStorage de forma robusta
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mockUser');
    try {
      if (!saved || saved === 'undefined') return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Permite login con o sin token (para mockData)
  const login = (userData, authToken) => {
    setUser(userData);
    if (authToken) {
      setToken(authToken);
      localStorage.setItem('token', authToken);
    }
    localStorage.setItem('mockUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
  };

  const value = {
    user,
    token,
    login,
    logout,
    // Considera autenticado si hay usuario (mock) o token real
    isAuthenticated: !!user || !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 