import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, Store } from 'lucide-react';
import {
  AdminRestaurant,
  AdminRestaurantPayload,
  createAdminRestaurant,
  fetchAdminRestaurants,
} from '../../services/restaurants';

const RestaurantManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [search, setSearch] = useState('');
  const [newRestaurant, setNewRestaurant] = useState<AdminRestaurantPayload>({
    nom: '',
    adresse: '',
    description: '',
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
  }), [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return restaurants.filter((restaurant) => {
      const nom = restaurant.nom?.toLowerCase?.() ?? '';
      const adresse = restaurant.adresse?.toLowerCase?.() ?? '';
      const description = restaurant.description?.toLowerCase?.() ?? '';
      const utilisateur = restaurant.utilisateur_id ? String(restaurant.utilisateur_id) : '';

      return (
        nom.includes(normalizedSearch) ||
        utilisateur.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        adresse.includes(normalizedSearch)
      );
    });
  }, [restaurants, search]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newRestaurant.nom || !newRestaurant.adresse) {
      setError('Merci de renseigner au minimum le nom et l\'adresse.');
      return;
    }

    try {
      const created = await createAdminRestaurant(newRestaurant);
      setRestaurants((current) => [created, ...current]);
      setError(null);
      setNewRestaurant({ nom: '', adresse: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Création impossible.');
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
        <p className="text-gray-600">Créez et suivez les restaurants partenaires en respectant la table MySQL `restaurants` (colonnes nom, adresse, description).</p>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Créer un restaurant</h2>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom du restaurant (colonne `nom`)</label>
              <input
                value={newRestaurant.nom}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, nom: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: Chez Fatou"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse (colonne `adresse`)</label>
              <input
                value={newRestaurant.adresse}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, adresse: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Quartier, ville"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newRestaurant.description || ''}
                onChange={(event) => setNewRestaurant({ ...newRestaurant, description: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Présentation du restaurant"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
            >
              Enregistrer dans `restaurants`
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Restaurants existants</h3>
              <p className="text-sm text-gray-600">Synchronisés avec la base `mf_eats`, table `restaurants`.</p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Rechercher..."
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">#{restaurant.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold flex items-center gap-2">
                      <Store className="h-4 w-4 text-orange-500" />
                      {restaurant.nom}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {restaurant.adresse}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{restaurant.utilisateur_id ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{restaurant.description || '—'}</td>
                  </tr>
                ))}
                {filteredRestaurants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                      Aucun restaurant trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagement;
