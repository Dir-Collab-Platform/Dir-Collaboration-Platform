import { useContext } from 'react';
import { UserContext } from './UserContext';
import { AuthContext } from '../AuthContext/AuthContext';

export default function UserProvider({ children }) {
  const { user, setUser, isLoading, error } = useContext(AuthContext);

  const updateUser = async (userData) => {
    // This can still be used for local UI updates or calls that update the user profile
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    setUser,
    updateUser,
    isLoading,
    error
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

