import React from 'react';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage or API
    const savedUser = localStorage.getItem('mf-eats-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call
    const mockUsers = [
      { id: '1', email: 'admin@mfeats.com', name: 'Admin MF', phone: '+221771234567', role: 'admin' as const, createdAt: '2024-01-01' },
      { id: '2', email: 'restaurant@mfeats.com', name: 'Restaurant Dakar', phone: '+221771234568', role: 'restaurant' as const, createdAt: '2024-01-01' },
      { id: '3', email: 'livreur@mfeats.com', name: 'Livreur Pro', phone: '+221771234569', role: 'livreur' as const, createdAt: '2024-01-01' },
      { id: '4', email: 'client@mfeats.com', name: 'Client Test', phone: '+221771234570', role: 'client' as const, address: 'Dakar, Sénégal', createdAt: '2024-01-01' },
    ];
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('mf-eats-user', JSON.stringify(foundUser));
    } else {
      throw new Error('Identifiants invalides');
    }
    
    setLoading(false);
  };

  const register = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    
    // Simulate API call
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      phone: userData.phone!,
      role: userData.role!,
      address: userData.address,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('mf-eats-user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mf-eats-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};