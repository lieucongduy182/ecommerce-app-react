import React, { useEffect, useState } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

const AuthContext = React.createContext<{
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
} | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (!saved || saved === 'undefined' || saved === 'null') return null;
    return JSON.parse(saved);
  });
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password);

    const userData = {
      id: res.id,
      username: res.username,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
    };

    setToken(res.accessToken);
    setUser(userData);
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = async (updatedUser: User) => {
    await api.updateUser(updatedUser.id, {
      ...updatedUser,
      address: updatedUser.address
        ? {
            address: updatedUser.address.address,
            city: updatedUser.address.city,
            postalCode: updatedUser.address.postalCode,
          }
        : undefined,
      phone: updatedUser.phone,
    }, token!);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('orderData');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
