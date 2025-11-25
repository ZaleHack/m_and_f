import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MapPin, MoreHorizontal, Phone, Search, Store, XCircle } from 'lucide-react';
import {
  AdminRestaurant,
  AdminRestaurantPayload,
  createAdminRestaurant,
  fetchAdminRestaurants,
  toggleRestaurantOpen,
  updateRestaurantStatus,
} from '../../services/restaurants';

const statusColors: Record<AdminRestaurant['status'], string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800'
};

const RestaurantManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AdminRestaurant['status']>('all');
  const [newRestaurant, setNewRestaurant] = useState<AdminRestaurantPayload>({
    name: '',
    owner: '',
    address: '',
    phone: '',
    email: '',
    category: '',
    isOpen: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAdminRestaurants();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de récupérer les restaurants.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = useMemo(() => ({
    total: restaurants.length,
    active: restaurants.filter((r) => r.status === 'active').length,
    pending: restaurants.filter((r) => r.status === 'pending').length,
    openNow: restaurants.filter((r) => r.isOpen).length,
  }), [restaurants]);

  const filteredRestaurants = useMemo(() => restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.owner.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || restaurant.status === filterStatus;

    return matchesSearch && matchesStatus;
  }), [restaurants, search, filterStatus]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newRestaurant.name || !newRestaurant.owner || !newRestaurant.email || !newRestaurant.phone || !newRestaurant.address) {
      setError('Merci de renseigner le nom, le propriétaire, l\'email, le téléphone et l\'adresse.');
      return;
    }

    try {
      const created = await createAdminRestaurant(newRestaurant);
      setRestaurants((current) => [created, ...current]);
      setError(null);
      setNewRestaurant({
        name: '',
        owner: '',
        address: '',
        phone: '',
        email: '',
        category: '',
        isOpen: true
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Création impossible.');
    }
  };

  const toggleOpenStatus = async (id: number) => {
    try {
      const { isOpen } = await toggleRestaurantOpen(id);
      setRestaurants((current) => current.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, isOpen } : restaurant
      ));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mise à jour impossible.');
    }
  };

  const updateStatus = async (id: number, status: AdminRestaurant['status']) => {
    try {
      await updateRestaurantStatus(id, status);
      setRestaurants((current) => current.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, status } : restaurant
      ));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mise à jour impossible.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">Chargement des restaurants...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des restaurants</h1>
        <p className="text-gray-600">Créez, validez et suivez les restaurants partenaires.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">En attente</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Ouverts maintenant</p>
          <p className="text-2xl font-bold text-orange-700">{stats.openNow}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Créer un restaurant</h2>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom du restaurant</label>
              <input
                value={newRestaurant.name}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, name: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: Chez Fatou"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Propriétaire</label>
              <input
                value={newRestaurant.owner}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, owner: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Nom et prénom"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email de contact</label>
                <input
                  type="email"
                  value={newRestaurant.email}
                  onChange={(event) => setNewRestaurant({ ...newRestaurant, email: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="contact@restaurant.sn"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  value={newRestaurant.phone}
                  onChange={(event) => setNewRestaurant({ ...newRestaurant, phone: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="+221 xx xxx xx xx"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse</label>
              <input
                value={newRestaurant.address}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, address: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Quartier, ville"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <input
                value={newRestaurant.category}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, category: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Cuisine sénégalaise, fast-food..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="restaurant-open"
                type="checkbox"
                checked={newRestaurant.isOpen}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, isOpen: event.target.checked })}
                className="h-4 w-4 text-orange-600 border-gray-300 rounded"
              />
              <label htmlFor="restaurant-open" className="text-sm text-gray-700">Ouvert dès l'activation</label>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white rounded-lg py-2.5 font-medium hover:bg-orange-700 transition-colors"
            >
              Enregistrer
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
                  placeholder="Rechercher par nom, propriétaire ou catégorie"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value as typeof filterStatus)}
                className="rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendus</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Restaurant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                          <Store className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{restaurant.name}</p>
                          <p className="text-sm text-gray-500">{restaurant.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{restaurant.address || 'Adresse à compléter'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{restaurant.category}</p>
                      <p className="text-xs text-gray-500">Créé le {restaurant.createdAt}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[restaurant.status]}`}>
                          {restaurant.status === 'active' && 'Actif'}
                          {restaurant.status === 'pending' && 'En attente'}
                          {restaurant.status === 'suspended' && 'Suspendu'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${restaurant.isOpen ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {restaurant.isOpen ? 'Ouvert' : 'Fermé'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {restaurant.status !== 'active' && (
                          <button
                            onClick={() => updateStatus(restaurant.id, 'active')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Valider
                          </button>
                        )}
                        {restaurant.status !== 'suspended' && (
                          <button
                            onClick={() => updateStatus(restaurant.id, 'suspended')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
                          >
                            <XCircle className="h-4 w-4" />
                            Suspendre
                          </button>
                        )}
                        <button
                          onClick={() => toggleOpenStatus(restaurant.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          {restaurant.isOpen ? 'Fermer' : 'Ouvrir'}
                        </button>
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

export default RestaurantManagement;
