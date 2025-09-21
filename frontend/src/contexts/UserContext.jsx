import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { verifyTokenRequest } from '../services/authService';
import { getUserByIdRequest } from '../services/userService';
import { getToken, removeToken } from '../utils/auth';


const UserContext = createContext();

const getUserRole = (user) => {
  if (user.is_super_admin) return 'super_admin';
  if (user.is_admin) return 'admin';
  return 'student';
};

export function UserProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(true);

  const clearUser = useCallback(() => {
    setUser(null);
    setUserRole(null);
    setError(null);
    setLoading(false);
  }, []);

  const hasRole = useCallback((role) => {
    return userRole === role
  }, [userRole]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const token = getToken();
    if (!token) {
      setError("No access token found");
      setLoading(false);
      return;
    }
      
    try {
      const verifyResponse = await verifyTokenRequest(token);
      const userId = verifyResponse.data.user_info.user_id;
      const userResponse = await getUserByIdRequest(userId);
      const userData = userResponse.data;
      setUser(userData);

      const role = getUserRole(userData);
      setUserRole(role);
    } catch (err) {
      removeToken();
      setUser(null);
      setUserRole(null);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  const reload = useCallback(() => fetchUser(), [fetchUser]);
  
  const value = useMemo(
    () => ({
      user,
      userRole,
      error,
      loading,
      clearUser,
      hasRole,
      reload,
    }),
    [user, userRole, error, loading, clearUser, hasRole, reload]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}