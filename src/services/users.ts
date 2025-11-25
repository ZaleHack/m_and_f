import { apiRequest } from './api';

export interface AdminUserPayload {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'restaurant' | 'livreur' | 'client';
  status?: 'active' | 'invited' | 'suspended';
}

export interface AdminUser extends AdminUserPayload {
  id: number;
  createdAt: string;
  status: 'active' | 'invited' | 'suspended';
}

export const fetchAdminUsers = () => apiRequest<AdminUser[]>('/admin/users', { method: 'GET' });

export const createAdminUser = (payload: AdminUserPayload) =>
  apiRequest<AdminUser>('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateAdminUser = (id: number, payload: AdminUserPayload) =>
  apiRequest<AdminUser>(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteAdminUser = (id: number) => apiRequest<void>(`/admin/users/${id}`, { method: 'DELETE' });
