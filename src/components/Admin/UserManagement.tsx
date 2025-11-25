import React, { useMemo, useState } from 'react';
import { CheckCircle2, Mail, MoreHorizontal, Phone, Search, Shield, UserPlus } from 'lucide-react';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'restaurant' | 'livreur' | 'client';
  status: 'active' | 'invited' | 'suspended';
  createdAt: string;
}

const initialUsers: PlatformUser[] = [
  {
    id: 'USR-2024-001',
    name: 'Fatou Ndiaye',
    email: 'fatou.ndiaye@example.com',
    phone: '+221 77 100 20 30',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: 'USR-2024-002',
    name: 'Ousmane Ba',
    email: 'ousmane.ba@example.com',
    phone: '+221 77 200 30 40',
    role: 'restaurant',
    status: 'active',
    createdAt: '2024-02-05'
  },
  {
    id: 'USR-2024-003',
    name: 'Aïssatou Diop',
    email: 'aissatou.diop@example.com',
    phone: '+221 77 300 40 50',
    role: 'livreur',
    status: 'invited',
    createdAt: '2024-03-15'
  }
];

const statusStyles: Record<PlatformUser['status'], string> = {
  active: 'bg-green-50 text-green-700',
  invited: 'bg-blue-50 text-blue-700',
  suspended: 'bg-red-50 text-red-700'
};

const roleLabels: Record<PlatformUser['role'], string> = {
  admin: 'Administrateur',
  restaurant: 'Restaurant',
  livreur: 'Livreur',
  client: 'Client'
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | PlatformUser['role']>('all');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'client' as PlatformUser['role'],
  });

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role === 'admin').length,
    restaurants: users.filter((user) => user.role === 'restaurant').length,
    livreurs: users.filter((user) => user.role === 'livreur').length,
  }), [users]);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  }), [users, search, filterRole]);

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const newEntry: PlatformUser = {
      id: `USR-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      status: 'invited',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setUsers([newEntry, ...users]);
    setNewUser({ name: '', email: '', phone: '', role: 'client' });
  };

  const activateUser = (id: string) => {
    setUsers((current) => current.map((user) =>
      user.id === id ? { ...user, status: 'active' } : user
    ));
  };

  const suspendUser = (id: string) => {
    setUsers((current) => current.map((user) =>
      user.id === id ? { ...user, status: 'suspended' } : user
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs de la plateforme</h1>
        <p className="text-gray-600">Invitez et administrez les comptes administrateurs, restaurants, livreurs et clients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Comptes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Administrateurs</p>
          <p className="text-2xl font-bold text-purple-700">{stats.admins}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Restaurants</p>
          <p className="text-2xl font-bold text-orange-700">{stats.restaurants}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Livreurs</p>
          <p className="text-2xl font-bold text-blue-700">{stats.livreurs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Créer un utilisateur</h2>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                value={newUser.name}
                onChange={(event) => setNewUser({ ...newUser, name: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: Aïssatou Diop"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="contact@exemple.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                value={newUser.phone}
                onChange={(event) => setNewUser({ ...newUser, phone: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="+221 xx xxx xx xx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <select
                value={newUser.role}
                onChange={(event) => setNewUser({ ...newUser, role: event.target.value as PlatformUser['role'] })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
              >
                <option value="admin">Administrateur</option>
                <option value="restaurant">Restaurant</option>
                <option value="livreur">Livreur</option>
                <option value="client">Client</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white rounded-lg py-2.5 font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Inviter
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex flex-1 gap-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher par nom ou email"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <select
                value={filterRole}
                onChange={(event) => setFilterRole(event.target.value as typeof filterRole)}
                className="rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="restaurant">Restaurants</option>
                <option value="livreur">Livreurs</option>
                <option value="client">Clients</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{user.phone || 'Téléphone non renseigné'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{roleLabels[user.role]}</p>
                      <p className="text-xs text-gray-500">Créé le {user.createdAt}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[user.status]}`}>
                        {user.status === 'active' && 'Actif'}
                        {user.status === 'invited' && 'Invitation envoyée'}
                        {user.status === 'suspended' && 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status !== 'active' && (
                          <button
                            onClick={() => activateUser(user.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Activer
                          </button>
                        )}
                        {user.status !== 'suspended' && (
                          <button
                            onClick={() => suspendUser(user.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                          >
                            Suspendre
                          </button>
                        )}
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
