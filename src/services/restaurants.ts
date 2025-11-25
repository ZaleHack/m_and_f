import { apiRequest } from './api';

export interface AdminRestaurantPayload {
  name: string;
  owner: string;
  address: string;
  phone: string;
  email: string;
  category?: string;
  isOpen?: boolean;
}

export interface AdminRestaurant {
  id: number;
  name: string;
  owner: string;
  address: string;
  phone: string;
  email: string;
  category: string;
  status: 'active' | 'pending' | 'suspended';
  isOpen: boolean;
  createdAt: string;
}

export const fetchAdminRestaurants = () => apiRequest<AdminRestaurant[]>('/admin/restaurants', { method: 'GET' });

export const createAdminRestaurant = (payload: AdminRestaurantPayload) =>
  apiRequest<AdminRestaurant>('/admin/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const toggleRestaurantOpen = (id: number) =>
  apiRequest<{ id: number; isOpen: boolean }>(`/admin/restaurants/${id}/toggle-open`, { method: 'PATCH' });

export const updateRestaurantStatus = (id: number, status: AdminRestaurant['status']) =>
  apiRequest<{ id: number; status: AdminRestaurant['status'] }>(`/admin/restaurants/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
