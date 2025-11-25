import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { fetchProfile, loginRequest, logoutRequest, registerRequest } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'mf-eats-user';
const TOKEN_STORAGE_KEY = 'mf-eats-token';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const persistSession = (user: User, token: string) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const clearSession = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (savedToken && !savedUser) {
      // Token sans profil en cache, on récupère les informations à jour depuis l'API
      fetchProfile(savedToken)
        .then((freshUser) => {
          setUser(freshUser);
          setToken(savedToken);
          persistSession(freshUser, savedToken);
        })
        .catch(() => {
          clearSession();
        })
        .finally(() => setLoading(false));
      return;
    }

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user: authenticatedUser, token: accessToken } = await loginRequest(email, password);
      setUser(authenticatedUser);
      setToken(accessToken);
      persistSession(authenticatedUser, accessToken);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setLoading(true);
    try {
      const { user: registeredUser, token: accessToken } = await registerRequest({
        email: userData.email!,
        password,
        name: userData.name!,
        phone: userData.phone!,
        role: userData.role!,
        address: userData.address,
      });
      setUser(registeredUser);
      setToken(accessToken);
      persistSession(registeredUser, accessToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY) || undefined;
    await logoutRequest(currentToken);
    setUser(null);
    setToken(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
