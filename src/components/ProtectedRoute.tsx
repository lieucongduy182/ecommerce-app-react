import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  console.log('🚀 [Debug] ~ ProtectedRoute.tsx:8 ~ ProtectedRoute ~ user:', user)
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
