import { DEMO_PASSWORD } from '../config/auth';
import { User } from '../types';
import { apiRequest } from './api';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: User['role'];
  address?: string;
}

const demoUsers: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'admin@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Admin MF',
    phone: '+221771234567',
    role: 'admin',
    createdAt: '2025-11-15 14:15:49',
  },
  {
    id: '2',
    email: 'restaurant@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Restaurant Dakar',
    phone: '+221771234568',
    role: 'restaurant',
    address: 'Dakar, Sénégal',
    createdAt: '2025-11-15 14:15:49',
  },
  {
    id: '3',
    email: 'livreur@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Livreur Pro',
    phone: '+221771234569',
    role: 'livreur',
    address: 'Dakar, Sénégal',
    createdAt: '2025-11-15 14:15:49',
  },
  {
    id: '4',
    email: 'client@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Client Test',
    phone: '+221771234570',
    role: 'client',
    address: 'Dakar, Sénégal',
    createdAt: '2025-11-15 14:15:49',
  },
];

const buildDemoAuthResponse = (user: User): AuthResponse => ({
  user,
  token: `demo-${user.id}-${Date.now()}`,
});

const tryDemoLogin = (email: string, password: string): AuthResponse | null => {
  const demoUser = demoUsers.find((account) => account.email === email && account.password === password);
  if (!demoUser) return null;

  const { password: _removed, ...publicUser } = demoUser;
  return buildDemoAuthResponse(publicUser);
};

export const loginRequest = async (email: string, password: string) => {
  try {
    return await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    const demoAuth = tryDemoLogin(email, password);
    if (demoAuth) return demoAuth;

    throw error;
  }
};

export const fetchProfile = (token?: string) => {
  if (token?.startsWith('demo-')) {
    const savedUser = localStorage.getItem('mf-eats-user');
    if (savedUser) {
      return Promise.resolve(JSON.parse(savedUser) as User);
    }
  }

  return apiRequest<User>('/auth/me', {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const registerRequest = (payload: RegisterPayload) =>
  apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const logoutRequest = (token?: string) =>
  apiRequest<void>('/auth/logout', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }).catch(() => {
    // Le backend peut ne pas exposer de route de déconnexion; on ignore l'erreur.
    return undefined;
  });
