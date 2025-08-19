import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { me } from '../api/auth';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state (token, user) and actions to the app. */
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      if (!token) return;
      try {
        const profile = await me();
        if (mounted) setUser(profile);
      } catch (e) {
        // invalid token - clear
        localStorage.removeItem('token');
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMe();
    return () => { mounted = false; };
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    loginWithToken: (tkn) => {
      localStorage.setItem('token', tkn);
      setToken(tkn);
      setLoading(true);
    },
    logout: () => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    },
    setUser
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
