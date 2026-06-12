import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  userName: string;
  setUserName: (name: string) => void;
  specializations: string[];
  setSpecializations: (specs: string[]) => void;
  isGuest: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userName: '',
  setUserName: () => {},
  specializations: [],
  setSpecializations: () => {},
  isGuest: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    // TODO: Connect to backend
    setIsAuthenticated(true);
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    // TODO: Connect to backend
    setUserName(data.name);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserName('');
    setSpecializations([]);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      userName,
      setUserName,
      specializations,
      setSpecializations,
      isGuest: !isAuthenticated,
      isAuthenticated,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
