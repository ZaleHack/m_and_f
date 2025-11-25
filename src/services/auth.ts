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

export const loginRequest = (email: string, password: string) =>
  apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const fetchProfile = (token?: string) =>
  apiRequest<User>('/auth/me', {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

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
