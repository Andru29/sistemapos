import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;