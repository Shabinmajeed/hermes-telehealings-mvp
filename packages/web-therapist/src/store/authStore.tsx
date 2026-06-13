import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { TherapistUser } from '@/types';

interface AuthContextValue {
  user: TherapistUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: TherapistUser, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<TherapistUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TherapistUser | null>(() => {
    const stored = localStorage.getItem('therapist_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('therapist_token'),
  );

  const login = useCallback((user: TherapistUser, token: string) => {
    localStorage.setItem('therapist_token', token);
    localStorage.setItem('therapist_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('therapist_token');
    localStorage.removeItem('therapist_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<TherapistUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('therapist_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      updateUser,
    }),
    [user, token, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
