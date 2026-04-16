import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { normalizeRole } from '../utils/helpers';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if requiredRole is specified
  if (requiredRole && normalizeRole(user?.role) !== normalizeRole(requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
