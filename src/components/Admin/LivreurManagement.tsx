import React, { useEffect, useMemo, useState } from 'react';
import { Bike, Car, CheckCircle2, Clock3, MoreHorizontal, Phone, Plus, Search, Truck } from 'lucide-react';
import {
  AdminLivreur,
  AdminLivreurPayload,
  createAdminLivreur,
  fetchAdminLivreurs,
  updateLivreurStatus,
} from '../../services/livreurs';

const statusLabels: Record<AdminLivreur['status'], { label: string; classes: string }> = {
  available: { label: 'Disponible', classes: 'bg-green-50 text-green-700' },
  busy: { label: 'En livraison', classes: 'bg-yellow-50 text-yellow-700' },
  inactive: { label: 'Inactif', classes: 'bg-gray-100 text-gray-700' },
};

const vehicleIcon = {
  bike: Bike,
  moto: Truck,
  car: Car
};

type LivreurFormState = {
  name: string;
  email: string;
  phone: string;
  vehicle: AdminLivreurPayload['vehicle'];
  zone: string;
  utilisateurId: string;
  restaurantId: string;
  status: AdminLivreurPayload['status'];
};

const LivreurManagement: React.FC = () => {
  const [livreurs, setLivreurs] = useState<AdminLivreur[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AdminLivreur['status']>('all');
  const [newLivreur, setNewLivreur] = useState<LivreurFormState>({
    name: '',
    email: '',
    phone: '',
    vehicle: 'moto',
    zone: '',
    utilisateurId: '',
    restaurantId: '',
    status: 'available',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLivreurs = async () => {
      try {
        const data = await fetchAdminLivreurs();
        setLivreurs(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Impossible de charger les livreurs.');
      } finally {
        setLoading(false);
      }
    };

    loadLivreurs();
  }, []);

  const stats = useMemo(() => ({
    total: livreurs.length,
    available: livreurs.filter((livreur) => livreur.status === 'available').length,
    busy: livreurs.filter((livreur) => livreur.status === 'busy').length,
  }), [livreurs]);

  const filteredLivreurs = useMemo(() => livreurs.filter((livreur) => {
    const matchesSearch = livreur.name.toLowerCase().includes(search.toLowerCase()) ||
      livreur.zone.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || livreur.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [livreurs, search, filterStatus]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newLivreur.name || !newLivreur.phone || !newLivreur.zone || !newLivreur.email || !newLivreur.utilisateurId) {
      setError('Merci de renseigner tous les champs obligatoires, y compris l\'utilisateur et le restaurant associé.');
      return;
    }

    const utilisateurId = Number(newLivreur.utilisateurId);
    const restaurantId = newLivreur.restaurantId ? Number(newLivreur.restaurantId) : undefined;
    if (Number.isNaN(utilisateurId) || (newLivreur.restaurantId && Number.isNaN(restaurantId))) {
      setError('`utilisateur_id` et `restaurant_id` doivent être numériques pour respecter la table `livreurs_restaurants`.');
      return;
    }

    try {
      const payload: AdminLivreurPayload = {
        name: newLivreur.name,
        email: newLivreur.email,
        phone: newLivreur.phone,
        vehicle: newLivreur.vehicle,
        zone: newLivreur.zone,
        utilisateur_id: utilisateurId,
        restaurant_id: restaurantId,
        status: newLivreur.status,
      };
      const created = await createAdminLivreur(payload);
      setLivreurs((current) => [created, ...current]);
      setNewLivreur({ name: '', email: '', phone: '', vehicle: 'moto', zone: '', utilisateurId: '', restaurantId: '', status: 'available' });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de créer le livreur.');
    }
  };

  const updateStatus = async (id: number, status: AdminLivreur['status']) => {
    try {
      const updated = await updateLivreurStatus(id, status);
      setLivreurs((current) => current.map((livreur) =>
        livreur.id === id ? updated : livreur
      ));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de mettre à jour le statut.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">Chargement des livreurs...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des livreurs</h1>
        <p className="text-gray-600">Ajoutez de nouveaux livreurs et gérez leur disponibilité.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Disponibles</p>
          <p className="text-2xl font-bold text-green-700">{stats.available}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">En livraison</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.busy}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un livreur</h2>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                value={newLivreur.name}
                onChange={(event) => setNewLivreur({ ...newLivreur, name: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: Fatou Sene"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newLivreur.email}
                onChange={(event) => setNewLivreur({ ...newLivreur, email: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="livreur@exemple.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                value={newLivreur.phone}
                onChange={(event) => setNewLivreur({ ...newLivreur, phone: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="+221 xx xxx xx xx"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Zone de couverture</label>
              <input
                value={newLivreur.zone}
                onChange={(event) => setNewLivreur({ ...newLivreur, zone: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Quartier ou commune"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID utilisateur (`utilisateur_id`)</label>
                <input
                  type="number"
                  min="1"
                  value={newLivreur.utilisateurId}
                  onChange={(event) => setNewLivreur({ ...newLivreur, utilisateurId: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Référence dans la table utilisateurs"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Restaurant associé (`restaurant_id`)</label>
                <input
                  type="number"
                  min="1"
                  value={newLivreur.restaurantId}
                  onChange={(event) => setNewLivreur({ ...newLivreur, restaurantId: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Clé étrangère table restaurants"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Véhicule</label>
                <select
                  value={newLivreur.vehicle}
                  onChange={(event) => setNewLivreur({ ...newLivreur, vehicle: event.target.value as AdminLivreur['vehicle'] })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                >
                  <option value="bike">Vélo</option>
                  <option value="moto">Moto</option>
                  <option value="car">Voiture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  value={newLivreur.status}
                  onChange={(event) => setNewLivreur({ ...newLivreur, status: event.target.value as AdminLivreur['status'] })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                >
                  <option value="available">Disponible</option>
                  <option value="busy">En livraison</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white rounded-lg py-2.5 font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter
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
                  placeholder="Rechercher par nom ou zone"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value as typeof filterStatus)}
                className="rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="available">Disponibles</option>
                <option value="busy">En livraison</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Livreur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Zone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Performances</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLivreurs.map((livreur) => {
                  const VehicleIcon = vehicleIcon[livreur.vehicle];
                  const badge = statusLabels[livreur.status];

                  return (
                    <tr key={livreur.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <VehicleIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{livreur.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4" /> {livreur.phone}</p>
                          <p className="text-xs text-gray-500">Utilisateur #{livreur.utilisateur_id ?? livreur.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{livreur.zone}</p>
                      <p className="text-xs text-gray-500">ID: {livreur.id} • Restaurant #{livreur.restaurant_id ?? 'N/A'}</p>
                    </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock3 className="h-4 w-4 text-gray-400" />
                          <span>{livreur.deliveries} livraisons</span>
                          <span className="text-gray-300">•</span>
                          <span>{livreur.rating.toFixed(1)}★</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {livreur.status !== 'available' && (
                            <button
                              onClick={() => updateStatus(livreur.id, 'available')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Libérer
                            </button>
                          )}
                          {livreur.status !== 'busy' && (
                            <button
                              onClick={() => updateStatus(livreur.id, 'busy')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100"
                            >
                              En tournée
                            </button>
                          )}
                          {livreur.status !== 'inactive' && (
                            <button
                              onClick={() => updateStatus(livreur.id, 'inactive')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                              Inactif
                            </button>
                          )}
                          <button className="p-2 hover:bg-gray-100 rounded-md">
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivreurManagement;
