import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('brick_admin');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem('brick_admin', JSON.stringify(userData));
    setAdmin(userData);
  };

  const logout = () => {
    localStorage.removeItem('brick_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);