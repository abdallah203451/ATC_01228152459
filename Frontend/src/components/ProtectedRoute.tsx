
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error('Please login to access this page');
        navigate('/login', { replace: true });
      } else if (requiredRole && user?.role !== requiredRole) {
        toast.error('You do not have permission to access this page');
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user?.role, requiredRole]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return isAuthenticated && (!requiredRole || user?.role === requiredRole) ? (
    <>{children}</>
  ) : null;
};

export default ProtectedRoute;
