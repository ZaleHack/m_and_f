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

export interface RestaurantPayload {
  owner_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  category?: string;
  cuisine_types?: string[];
  image_url?: string;
  cover_image_url?: string;
  delivery_time?: string;
  delivery_fee?: number;
  minimum_order?: number;
  opening_hours?: Record<string, unknown>;
}

export interface RestaurantRecord {
  id: number;
  owner_id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string | null;
  cuisine_types?: string[] | null;
  category?: string | null;
  is_open: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
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

export const fetchRestaurants = () => apiRequest<RestaurantRecord[]>('/restaurants', { method: 'GET' });

export const createRestaurant = (payload: RestaurantPayload) =>
  apiRequest<RestaurantRecord>('/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
