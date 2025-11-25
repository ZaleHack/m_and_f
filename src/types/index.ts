export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'client' | 'restaurant' | 'livreur' | 'admin';
  avatar?: string;
  address?: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  isOpen: boolean;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  options?: MenuOption[];
}

export interface MenuOption {
  name: string;
  choices: string[];
  required: boolean;
  maxSelections?: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  livreurId?: string;
  items: OrderItem[];
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'cancelled';
  total: number;
  deliveryFee: number;
  paymentMethod: 'cash' | 'wave' | 'orange_money';
  paymentStatus: 'pending' | 'paid';
  deliveryAddress: string;
  customerPhone: string;
  notes?: string;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, string>;
}

export interface Livreur {
  id: string;
  userId: string;
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  rating: number;
  totalDeliveries: number;
  vehicleType: 'bike' | 'moto' | 'car';
  partneredRestaurants: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'payment' | 'system';
  read: boolean;
  createdAt: string;
}