import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { checkAuth } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Store the token in localStorage
            localStorage.setItem('auth_token', token);

            // Trigger a check in the context to update state immediately
            checkAuth().then(() => {
                // Redirect to dashboard
                navigate('/dashboard');
            });
        } else {
            // Handle error - maybe redirect to login with an error message
            console.error('Authentication failed: No token received');
            navigate('/?error=auth_failed');
        }
    }, [navigate, searchParams, checkAuth]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-medium">Authenticating with GitHub...</p>
            <p className="mt-2 text-neutral-400 text-sm">Please wait while we set up your session.</p>
        </div>
    );
};

export default AuthCallback;
