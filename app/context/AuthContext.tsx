'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, getCurrentUser, login as loginApi, logout as logoutApi, LoginCredentials } from '../services/userApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on mount
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const user = await loginApi(credentials);
      if (user) {
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 