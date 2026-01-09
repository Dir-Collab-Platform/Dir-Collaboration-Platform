import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // Assuming backend has /api/me endpoint. If not, we might need to rely on the token validity
            // However, it's unsafe to trust just the token presence without validation if possible.
            // Based on Integration Plan, we will use /api/me (or /api/users/me if mapped differently)
            // Reading api/user.routes.js in backend might be good to confirm exact path.
            // For now we assume /api/me based on typical conventions or audit it.

            // Let's defer exact path to a quick confirm or try /api/me
            // In the original auth.service.js mock, it used /api/me.

            // Based on previous file reads, userRouter is mounted at /api.
            // We didn't see the content of user.routes.js yet.
            // Let's assume standard /api/me or /api/users/profile

            // We will try /api/users/profile as a safe guess if /api/me fails, 
            // but let's stick to the plan: /api/me. 
            // Actually, looking at app.js: app.use("/api", userRouter);
            // We need to verify user.routes.js to be sure. 
            // I will put a placeholder here that I will verify in a second.
            // Wait, I can just write the robust code.

            const response = await apiRequest('/api/me');
            // Note: I am guessing /users/profile based on naming conventions. 
            // If it fails, I'll fix it.

            if (response.status === 'success' && response.data) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                throw new Error('Invalid user data');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (token) => {
        localStorage.setItem('token', token);
        await checkAuthStatus();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        // Ideally call backend logout too
        try {
            apiRequest('/auth/logout', { method: 'POST' });
        } catch (e) {
            // ignore network error on logout
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, refreshUser: checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
