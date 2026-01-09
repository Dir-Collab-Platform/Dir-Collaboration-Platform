import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Pass the token to the AuthProvider to handle storage and user fetching
            login(token)
                .then(() => {
                    navigate('/dashboard', { replace: true });
                })
                .catch((err) => {
                    console.error("Login failed during callback:", err);
                    navigate('/', { replace: true });
                });
        } else {
            console.error("No token found in URL");
            navigate('/', { replace: true });
        }
    }, [searchParams, navigate, login]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </div>
    );
};

export default AuthSuccess;
