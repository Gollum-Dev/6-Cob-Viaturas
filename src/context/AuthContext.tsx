import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface RegisteredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  registeredUsers: RegisteredUser[];
  login: (milNumber: string, password: string) => boolean;
  register: (password: string, role: UserRole, milNumber: string, rank: string, name: string, unit: string) => boolean;
  updateUser: (id: string, updates: Partial<RegisteredUser>) => void;
  deleteUser: (id: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('fleet_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('fleet_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fleet_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fleet_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fleet_user');
    }
  }, [user]);

  const login = (milNumber: string, password: string) => {
    // Check registered users first
    const foundUser = registeredUsers.find(
      u => u.milNumber === milNumber && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userSession } = foundUser;
      setUser(userSession);
      return true;
    }

    // Default password logic for military access
    if (password === 'transporte123' && milNumber === '1000000') {
      const transportUser: RegisteredUser = {
        id: 'user-transporte',
        password: password,
        milNumber: milNumber,
        role: UserRole.ADMINISTRADOR,
        rank: 'Administrador',
        name: 'Administrador do Sistema',
        unit: 'POUSO ALEGRE',
      };
      
      const { password: _, ...userSession } = transportUser;
      setUser(userSession);
      return true;
    }

    if (password === '123456' && /^\d{7}$/.test(milNumber)) {
      const newUser: RegisteredUser = {
        id: Math.random().toString(36).substr(2, 9),
        password: password,
        milNumber: milNumber,
        role: UserRole.OPERACIONAL, // Default role
        rank: 'Praça',
        name: `Militar ${milNumber}`,
        unit: 'ITAJUBA',
      };

      setRegisteredUsers(prev => [...prev, newUser]);
      
      const { password: _, ...userSession } = newUser;
      setUser(userSession);
      return true;
    }

    return false;
  };

  const register = (password: string, role: UserRole, milNumber: string, rank: string, name: string, unit: string) => {
    if (registeredUsers.some(u => u.milNumber === milNumber)) {
      return false; // User already exists
    }

    const newUser: RegisteredUser = {
      id: Math.random().toString(36).substr(2, 9),
      password,
      role,
      milNumber,
      rank,
      name,
      unit,
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    return true;
  };

  const updateUser = (id: string, updates: Partial<RegisteredUser>) => {
    setRegisteredUsers(prev => {
      const updated = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      
      // Sync session if current user is updated
      if (user && user.id === id) {
        const updatedUser = updated.find(u => u.id === id);
        if (updatedUser) {
          const { password: _, ...userSession } = updatedUser;
          setUser(userSession);
        }
      }
      
      return updated;
    });
  };

  const deleteUser = (id: string) => {
    setRegisteredUsers(currentUsers => {
      const updatedUsers = currentUsers.filter(u => u.id !== id);
      // Immediately sync with localStorage as an extra precaution
      localStorage.setItem('fleet_registered_users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
    
    // If current user is deleted, logout
    if (user && user.id === id) {
      logout();
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      registeredUsers, 
      login, 
      register, 
      updateUser,
      deleteUser, 
      logout, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
