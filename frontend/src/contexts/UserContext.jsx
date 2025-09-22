import React, { createContext, useContext, useMemo, useCallback } from 'react';
import useUserSession from '../features/auth/hooks/useUserSession';

const UserContext = createContext(null);

const getUserRole = (user) => {
  if (!user) return null;
  if (user.is_super_admin) return 'super_admin';
  if (user.is_admin) return 'admin';
  return 'student';
};

export function UserProvider({ children }) {
  const { user, loading, error, refresh, clear } = useUserSession();

  const userRole = useMemo(() => getUserRole(user), [user]);

  const hasRole = useCallback(
    (role) => userRole === role,
    [userRole]
  );

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    // states
    user,
    userRole,
    loading,
    error,

    // helpers
    isAuthenticated,
    hasRole,

    // acciones
    reload: refresh,
    clearUser: clear,
  }), [user, userRole, loading, error, isAuthenticated, hasRole, refresh, clear]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}