import { DEMO_PASSWORD } from '../config/auth';
import { User } from '../types';
import { AdminLivreur, AdminLivreurPayload } from './livreurs';
import { AdminRestaurant, AdminRestaurantPayload } from './restaurants';
import { AdminUser, AdminUserPayload } from './users';
import { RegisterPayload } from './auth';

interface MockRequestOptions {
  method?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
}

const demoUsers: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'admin@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Admin MF',
    phone: '+221771234567',
    role: 'admin',
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: '2',
    email: 'restaurant@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Restaurant Dakar',
    phone: '+221771234568',
    role: 'restaurant',
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: '3',
    email: 'livreur@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Livreur Pro',
    phone: '+221771234569',
    role: 'livreur',
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: '4',
    email: 'client@mfeats.com',
    password: DEMO_PASSWORD,
    name: 'Client Test',
    phone: '+221771234570',
    role: 'client',
    createdAt: '2025-11-15T14:15:49Z',
  },
];

let adminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Admin MF',
    email: 'admin@mfeats.com',
    phone: '+221771234567',
    role: 'admin',
    status: 'active',
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: 2,
    name: 'Restaurant Dakar',
    email: 'restaurant@mfeats.com',
    phone: '+221771234568',
    role: 'restaurant',
    status: 'active',
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: 3,
    name: 'Livreur Pro',
    email: 'livreur@mfeats.com',
    phone: '+221771234569',
    role: 'livreur',
    status: 'active',
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: 4,
    name: 'Client Test',
    email: 'client@mfeats.com',
    phone: '+221771234570',
    role: 'client',
    status: 'active',
    createdAt: '2025-11-15T14:15:49Z',
  },
];

let adminLivreurs: AdminLivreur[] = [
  {
    id: 1,
    userId: 100,
    name: 'Ousmane Ba',
    email: 'livreur@mfeats.com',
    phone: '+221 77 111 22 33',
    vehicle: 'moto',
    zone: 'Dakar Plateau',
    status: 'available',
    deliveries: 1250,
    rating: 4.9,
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: 2,
    userId: 101,
    name: 'Fatou Sene',
    email: 'fatou@mfeats.com',
    phone: '+221 76 222 33 44',
    vehicle: 'bike',
    zone: 'Mermoz - Ouakam',
    status: 'busy',
    deliveries: 980,
    rating: 4.7,
    createdAt: '2025-11-15T14:15:49Z',
  },
];

let adminRestaurants: AdminRestaurant[] = [
  {
    id: 1,
    name: 'Chez Fatou',
    owner: 'Fatou Sene',
    address: 'Plateau, Dakar',
    phone: '+221771111111',
    email: 'contact@chezfatou.sn',
    category: 'Sénégalaise',
    status: 'active',
    isOpen: true,
    createdAt: '2025-11-15T14:15:49Z',
  },
  {
    id: 2,
    name: 'Le Lagon',
    owner: 'Ousmane Diallo',
    address: 'Corniche Ouest, Dakar',
    phone: '+221772222222',
    email: 'hello@lelagon.sn',
    category: 'Poisson & fruits de mer',
    status: 'pending',
    isOpen: false,
    createdAt: '2025-11-15T14:15:49Z',
  },
];

let lastAuthUser: User | null = null;
let nextUserId = adminUsers.length + 1;
let nextLivreurId = adminLivreurs.length + 1;
let nextRestaurantId = adminRestaurants.length + 1;

const isNetworkError = (error: unknown) => error instanceof TypeError;
const parseBody = (body?: BodyInit | null) => (typeof body === 'string' ? JSON.parse(body) : body ? JSON.parse(body as string) : undefined);

export const shouldUseMockApi = () => import.meta.env.VITE_USE_MOCK_API !== 'false';

export const handleMockRequest = async <T>(path: string, options: MockRequestOptions): Promise<T | undefined> => {
  if (!shouldUseMockApi()) return undefined;

  const method = (options.method || 'GET').toUpperCase();
  const payload = parseBody(options.body);

  if (path === '/auth/login' && method === 'POST') {
    const match = demoUsers.find((user) => user.email === payload?.email && user.password === payload?.password);
    if (!match) throw new Error('Identifiants invalides (mode démo).');
    const { password, ...safeUser } = match;
    void password;
    lastAuthUser = safeUser;
    return { user: safeUser, token: `demo-${safeUser.id}-${Date.now()}` } as T;
  }

  if (path === '/auth/register' && method === 'POST') {
    const baseUser: User = {
      id: String(demoUsers.length + 1),
      email: payload?.email || 'nouveau@mf-eats.com',
      name: payload?.name || 'Nouveau Compte',
      phone: payload?.phone || '+221770000000',
      role: (payload as RegisterPayload)?.role || 'client',
      createdAt: new Date().toISOString(),
    };
    demoUsers.push({ ...baseUser, password: payload?.password || DEMO_PASSWORD });
    lastAuthUser = baseUser;
    return { user: baseUser, token: `demo-${baseUser.id}-${Date.now()}` } as T;
  }

  if (path === '/auth/me' && method === 'GET') {
    if (!lastAuthUser) throw new Error('Session démo expirée.');
    return lastAuthUser as T;
  }

  if (path === '/auth/logout' && method === 'POST') {
    lastAuthUser = null;
    return undefined;
  }

  if (path === '/admin/users' && method === 'GET') {
    return [...adminUsers] as T;
  }

  if (path === '/admin/users' && method === 'POST') {
    const newUser: AdminUser = {
      id: nextUserId++,
      status: payload?.status || 'invited',
      createdAt: new Date().toISOString(),
      ...(payload as AdminUserPayload),
    };
    adminUsers = [newUser, ...adminUsers];
    return newUser as T;
  }

  const userIdMatch = path.match(/^\/admin\/users\/(\d+)$/);
  if (userIdMatch) {
    const userId = Number(userIdMatch[1]);
    if (method === 'PUT') {
      adminUsers = adminUsers.map((user) => (user.id === userId ? { ...user, ...(payload as AdminUserPayload) } : user));
      const updated = adminUsers.find((user) => user.id === userId);
      if (!updated) throw new Error('Utilisateur introuvable.');
      return updated as T;
    }
    if (method === 'DELETE') {
      adminUsers = adminUsers.filter((user) => user.id !== userId);
      return undefined;
    }
  }

  if (path === '/admin/livreurs' && method === 'GET') {
    return [...adminLivreurs] as T;
  }

  if (path === '/admin/livreurs' && method === 'POST') {
    const newLivreur: AdminLivreur = {
      id: nextLivreurId++,
      userId: nextUserId++,
      deliveries: 0,
      rating: 5,
      createdAt: new Date().toISOString(),
      ...(payload as AdminLivreurPayload),
      status: (payload as AdminLivreurPayload)?.status || 'available',
    } as AdminLivreur;
    adminLivreurs = [newLivreur, ...adminLivreurs];
    return newLivreur as T;
  }

  const livreurMatch = path.match(/^\/admin\/livreurs\/(\d+)\/status$/);
  if (livreurMatch) {
    const livreurId = Number(livreurMatch[1]);
    if (method === 'PATCH') {
      adminLivreurs = adminLivreurs.map((livreur) =>
        livreur.id === livreurId ? { ...livreur, status: (payload as { status: AdminLivreur['status'] }).status } : livreur
      );
      const updated = adminLivreurs.find((livreur) => livreur.id === livreurId);
      if (!updated) throw new Error('Livreur introuvable.');
      return updated as T;
    }
  }

  if (path === '/admin/restaurants' && method === 'GET') {
    return [...adminRestaurants] as T;
  }

  if (path === '/admin/restaurants' && method === 'POST') {
    const newRestaurant: AdminRestaurant = {
      id: nextRestaurantId++,
      status: 'pending',
      isOpen: payload?.isOpen ?? false,
      createdAt: new Date().toISOString(),
      category: (payload as AdminRestaurantPayload)?.category || 'Général',
      ...(payload as AdminRestaurantPayload),
    };
    adminRestaurants = [newRestaurant, ...adminRestaurants];
    return newRestaurant as T;
  }

  const restaurantToggleMatch = path.match(/^\/admin\/restaurants\/(\d+)\/toggle-open$/);
  if (restaurantToggleMatch && method === 'PATCH') {
    const restaurantId = Number(restaurantToggleMatch[1]);
    adminRestaurants = adminRestaurants.map((restaurant) => (restaurant.id === restaurantId
      ? { ...restaurant, isOpen: !restaurant.isOpen }
      : restaurant));
    const updated = adminRestaurants.find((restaurant) => restaurant.id === restaurantId);
    if (!updated) throw new Error('Restaurant introuvable.');
    return { id: updated.id, isOpen: updated.isOpen } as T;
  }

  const restaurantStatusMatch = path.match(/^\/admin\/restaurants\/(\d+)\/status$/);
  if (restaurantStatusMatch && method === 'PATCH') {
    const restaurantId = Number(restaurantStatusMatch[1]);
    const status = payload?.status as AdminRestaurant['status'];
    adminRestaurants = adminRestaurants.map((restaurant) => (restaurant.id === restaurantId
      ? { ...restaurant, status }
      : restaurant));
    const updated = adminRestaurants.find((restaurant) => restaurant.id === restaurantId);
    if (!updated) throw new Error('Restaurant introuvable.');
    return { id: updated.id, status: updated.status } as T;
  }

  return undefined;
};

export const handleNetworkFailureWithMock = async <T>(error: unknown, path: string, options: MockRequestOptions) => {
  if (!isNetworkError(error)) throw error;

  const response = await handleMockRequest<T>(path, options);
  if (response !== undefined) return response;

  throw error;
};
