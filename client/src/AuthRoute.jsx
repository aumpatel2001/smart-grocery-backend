import { Navigate } from 'react-router-dom';
import { getToken } from './api';

const AuthRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/login" replace />;
};

export default AuthRoute;
