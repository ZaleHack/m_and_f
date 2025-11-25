import React, { useMemo, useState } from 'react';
import { Bike, Car, CheckCircle2, Clock3, Mail, MoreHorizontal, Phone, Plus, Search, Truck, XCircle } from 'lucide-react';

interface Livreur {
  id: string;
  name: string;
  phone: string;
  vehicle: 'bike' | 'moto' | 'car';
  zone: string;
  status: 'available' | 'busy' | 'inactive';
  deliveries: number;
  rating: number;
}

const initialLivreurs: Livreur[] = [
  {
    id: 'DLV-2024-001',
    name: 'Ousmane Ba',
    phone: '+221 77 111 22 33',
    vehicle: 'moto',
    zone: 'Dakar Plateau',
    status: 'available',
    deliveries: 1250,
    rating: 4.9
  },
  {
    id: 'DLV-2024-002',
    name: 'Fatou Sene',
    phone: '+221 76 222 33 44',
    vehicle: 'bike',
    zone: 'Mermoz - Ouakam',
    status: 'busy',
    deliveries: 980,
    rating: 4.7
  },
  {
    id: 'DLV-2024-003',
    name: 'Pape Ndiaye',
    phone: '+221 77 333 44 55',
    vehicle: 'car',
    zone: 'Keur Massar',
    status: 'inactive',
    deliveries: 430,
    rating: 4.3
  }
];

const statusLabels: Record<Livreur['status'], { label: string; classes: string }> = {
  available: { label: 'Disponible', classes: 'bg-green-50 text-green-700' },
  busy: { label: 'En livraison', classes: 'bg-yellow-50 text-yellow-700' },
  inactive: { label: 'Inactif', classes: 'bg-gray-100 text-gray-700' },
};

const vehicleIcon = {
  bike: Bike,
  moto: Truck,
  car: Car
};

const LivreurManagement: React.FC = () => {
  const [livreurs, setLivreurs] = useState<Livreur[]>(initialLivreurs);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Livreur['status']>('all');
  const [newLivreur, setNewLivreur] = useState({
    name: '',
    phone: '',
    vehicle: 'moto' as Livreur['vehicle'],
    zone: '',
    status: 'available' as Livreur['status'],
  });

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

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newLivreur.name || !newLivreur.phone || !newLivreur.zone) return;

    const newEntry: Livreur = {
      id: `DLV-${Date.now()}`,
      name: newLivreur.name,
      phone: newLivreur.phone,
      vehicle: newLivreur.vehicle,
      zone: newLivreur.zone,
      status: newLivreur.status,
      deliveries: 0,
      rating: 5
    };

    setLivreurs([newEntry, ...livreurs]);
    setNewLivreur({ name: '', phone: '', vehicle: 'moto', zone: '', status: 'available' });
  };

  const updateStatus = (id: string, status: Livreur['status']) => {
    setLivreurs((current) => current.map((livreur) =>
      livreur.id === id ? { ...livreur, status } : livreur
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des livreurs</h1>
        <p className="text-gray-600">Ajoutez de nouveaux livreurs et gérez leur disponibilité.</p>
      </div>

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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Véhicule</label>
                <select
                  value={newLivreur.vehicle}
                  onChange={(event) => setNewLivreur({ ...newLivreur, vehicle: event.target.value as Livreur['vehicle'] })}
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
                  onChange={(event) => setNewLivreur({ ...newLivreur, status: event.target.value as Livreur['status'] })}
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
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{livreur.zone}</p>
                        <p className="text-xs text-gray-500">ID: {livreur.id}</p>
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
