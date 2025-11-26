import { apiRequest } from './api';

export interface AdminUserPayload {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'restaurant' | 'livreur' | 'client';
  /**
   * Champ optionnel permettant de stocker le type métier MySQL (colonne `type`)
   * afin que le formulaire reste aligné sur la table `utilisateurs`.
   */
  type?: 'administrateur' | 'restaurant' | 'livreur' | 'client';
  /** Colonne `mot_de_passe` dans la table `utilisateurs` */
  password?: string;
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
