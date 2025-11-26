import { apiRequest } from './api';

export interface AdminRestaurantPayload {
  nom: string;
  adresse: string;
  description?: string;
}

export interface AdminRestaurant {
  id: number;
  nom: string;
  utilisateur_id?: number;
  description?: string | null;
  adresse: string;
  createdAt: string;
}

export interface RestaurantPayload {
  utilisateur_id?: number;
  nom: string;
  adresse: string;
  description?: string;
}

export interface RestaurantRecord {
  id: number;
  utilisateur_id: number;
  nom: string;
  adresse: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchAdminRestaurants = () => apiRequest<AdminRestaurant[]>('/admin/restaurants', { method: 'GET' });

export const createAdminRestaurant = (payload: AdminRestaurantPayload) =>
  apiRequest<AdminRestaurant>('/admin/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchRestaurants = () => apiRequest<RestaurantRecord[]>('/restaurants', { method: 'GET' });

export const createRestaurant = (payload: RestaurantPayload) =>
  apiRequest<RestaurantRecord>('/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
