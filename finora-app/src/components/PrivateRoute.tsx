import { Navigate } from 'react-router-dom';
import { authApi } from '../services/api';

interface PrivateRouteProps {
    children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const isAuthenticated = authApi.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    return <>{children}</>;
};
