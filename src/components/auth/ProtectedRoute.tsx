import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) => {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to appropriate dashboard based on user role
  const getDashboardPath = () => {
    switch (usuario.perfil) {
      case 'professor':
        return '/professor';
      case 'admin':
        return '/admin';
      default:
        return '/dashboard';
    }
  };

  if (allowedRoles.length > 0 && !allowedRoles.includes(usuario.perfil)) {
    return <Navigate to={getDashboardPath()} replace />;
  }

  return children;
};