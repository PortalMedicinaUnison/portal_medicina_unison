import { createContext, useContext, useMemo, useCallback } from 'react';
import useUserSession from '../features/auth/hooks/useUserSession';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const { user, loading, error, refresh, clear } = useUserSession();

  // El backend envía el rol: 'student' | 'admin' | 'super_admin'.
  const userRole = user?.role ?? null;
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  const hasRole = useCallback((role) => userRole === role, [userRole]);

  const value = useMemo(() => ({
    // estado
    user,
    userRole,
    loading,
    error,

    // ayudas
    isAuthenticated: !!user,
    isAdmin,
    isSuperAdmin,
    hasRole,

    // acciones
    reload: refresh,
    clearUser: clear,
  }), [user, userRole, loading, error, isAdmin, isSuperAdmin, hasRole, refresh, clear]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}
