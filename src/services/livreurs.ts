import { apiRequest } from './api';

export type LivreurStatus = 'available' | 'busy' | 'inactive';
export type LivreurVehicle = 'bike' | 'moto' | 'car';

export interface AdminLivreurPayload {
  name: string;
  email: string;
  phone: string;
  vehicle: LivreurVehicle;
  zone: string;
  status?: LivreurStatus;
}

export interface AdminLivreur {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  vehicle: LivreurVehicle;
  zone: string;
  status: LivreurStatus;
  deliveries: number;
  rating: number;
  createdAt: string;
}

export const fetchAdminLivreurs = () => apiRequest<AdminLivreur[]>('/admin/livreurs', { method: 'GET' });

export const createAdminLivreur = (payload: AdminLivreurPayload) =>
  apiRequest<AdminLivreur>('/admin/livreurs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateLivreurStatus = (id: number, status: LivreurStatus) =>
  apiRequest<AdminLivreur>(`/admin/livreurs/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
