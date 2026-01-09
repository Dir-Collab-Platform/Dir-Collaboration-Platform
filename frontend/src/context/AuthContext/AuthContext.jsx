import { createContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logout as logoutService } from '../../services/auth.service/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await getCurrentUser();
            if (response.status === 'success') {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                // Token might be invalid or expired
                localStorage.removeItem('auth_token');
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
            setUser(null);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const logout = async () => {
        try {
            await logoutService();
        } catch (err) {
            console.error('Logout service failed:', err);
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = '/';
        }
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        error,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
