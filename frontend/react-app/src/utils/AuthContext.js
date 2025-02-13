import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Проверяем авторизацию при загрузке страницы
  useEffect(() => {
    window.electron.checkAuth().then((data) => {
      if (data.isAuthenticated) {
        setUser({ role: data.role });
      }
    });
  }, []);

// Вставьте вместо request правильный вызов функции login
const login = async (username, password) => {
  const response = await window.electron.login({ username, password });
  if (response.success) {
    setUser({ role: response.role });
    return true;
  }
  return false;
};


  const logout = async () => {
    await window.electron.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
