import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and helper methods across the app. */
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    api.me(token)
      .then((u) => {
        if (!mounted) return;
        setUser(u);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
        setToken("");
        localStorage.removeItem("auth_token");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    // Support various backend response shapes
    const t = res.token || res.access_token || res.jwt || "";
    if (!t) throw new Error("Login failed: token missing");
    setToken(t);
    localStorage.setItem("auth_token", t);
    const me = await api.me(t).catch(() => null);
    setUser(me);
    return { token: t, user: me };
  };

  const register = async (payload) => {
    await api.register(payload);
    // After successful registration, perform login for convenience
    return login(payload.email, payload.password);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("auth_token");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      loading,
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
