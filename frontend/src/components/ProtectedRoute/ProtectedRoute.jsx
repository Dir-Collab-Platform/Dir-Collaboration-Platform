import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-xl font-medium">Checking session...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to landing page but save the attempted location
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
