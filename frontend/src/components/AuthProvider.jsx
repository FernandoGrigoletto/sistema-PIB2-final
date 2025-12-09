import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiService from "../services/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await apiService.checkAuth();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    await apiService.login(email, password);
    await checkAuth();
    return true;
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setUser(null);
    }
  };

  const resetPassword = async (email, newPassword) => {
    await apiService.resetPassword(email, newPassword);
  };

  console.log("user", user);

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    resetPassword, // Adicionado conforme a necessidade lógica do segundo código
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
