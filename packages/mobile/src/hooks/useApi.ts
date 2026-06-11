import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      setData(response.data);
      return response;
    } catch (err: any) {
      const message = err.message || 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute, setData };
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, setError, clearError } =
    useAuthStore();

  const handleLogin = useCallback(
    async (phoneNumber: string, code: string) => {
      try {
        const response = await api.verifyPhoneCode(phoneNumber, code);
        if (response.data?.token && response.data?.user) {
          login(response.data.token, response.data.user);
        }
        return response;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [login, setError]
  );

  const handleSendCode = useCallback(
    async (phoneNumber: string) => {
      try {
        return await api.sendPhoneCode(phoneNumber);
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [setError]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    logout,
    sendCode: handleSendCode,
    clearError,
  };
}
