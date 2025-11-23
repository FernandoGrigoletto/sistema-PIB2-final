// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // 1. Se não estiver logado, manda pro login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Se a rota exige um cargo específico (ex: admin) e o usuário não tem
  if (requiredRole && !requiredRole.includes(user.role)) {
    // Redireciona para a Home ou uma página de "Acesso Negado"
    alert("Acesso restrito a administradores."); // Opcional
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;