import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../AuthContext/AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // If not authenticated, ensure socket is disconnected and return
        if (!isAuthenticated) {
            if (socketRef.current) {
                console.log('Socket.IO: Auth failed or logout, disconnecting...');
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Socket.IO: Authenticated but no token found');
            return;
        }

        // If already connected with same token (implied), skip
        if (socketRef.current?.connected) return;

        console.log('Socket.IO: Initializing connection...');

        // Initialize socket connection with authentication
        const newSocket = io(SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = newSocket;

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('Socket.IO: Connected', newSocket.id);
            setIsConnected(true);
            setConnectionError(null);
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Socket.IO: Disconnected', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                // Server disconnected, reconnect manually
                newSocket.connect();
            }
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket.IO: Connection error', error);
            setConnectionError(error.message);
            setIsConnected(false);
        });

        newSocket.on('reconnect', (attemptNumber) => {
            console.log('Socket.IO: Reconnected after', attemptNumber, 'attempts');
            setIsConnected(true);
            setConnectionError(null);
        });

        newSocket.on('reconnect_error', (error) => {
            console.error('Socket.IO: Reconnection error', error);
        });

        newSocket.on('reconnect_failed', () => {
            console.error('Socket.IO: Reconnection failed');
            setConnectionError('Failed to reconnect to server');
        });

        setSocket(newSocket);

        // Cleanup on unmount or when auth state changes
        return () => {
            if (newSocket) {
                console.log('Socket.IO: Cleaning up listener...');
                newSocket.removeAllListeners();
                newSocket.disconnect();
            }
        };
    }, [isAuthenticated]);

    const value = {
        socket,
        isConnected,
        connectionError,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
