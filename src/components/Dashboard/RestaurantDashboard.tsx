import React, { useEffect, useMemo, useState } from 'react';
import { Building2, CheckCircle2, Phone, RefreshCcw, ScrollText, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createRestaurant, fetchRestaurants, RestaurantRecord } from '../../services/restaurants';

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: user?.phone || '',
    email: user?.email || '',
    category: '',
    delivery_time: '',
    delivery_fee: '0',
    minimum_order: '0',
  });

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const entries = await fetchRestaurants();
        const mine = entries.find((entry) => String(entry.owner_id) === String(user.id));
        if (mine) setRestaurant(mine);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement du restaurant :', err);
        setError(err instanceof Error ? err.message : 'Impossible de récupérer votre restaurant.');
      } finally {
        setLoading(false);
      }
    };

    void loadRestaurant();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.id) {
      setError('Utilisateur non authentifié.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createRestaurant({
        owner_id: Number(user.id),
        name: formData.name,
        description: formData.description || undefined,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        category: formData.category || undefined,
        delivery_time: formData.delivery_time || undefined,
        delivery_fee: Number(formData.delivery_fee) || 0,
        minimum_order: Number(formData.minimum_order) || 0,
      });
      setRestaurant(created);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la création du restaurant :', err);
      setError(err instanceof Error ? err.message : 'Création impossible, merci de réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = useMemo(() => {
    if (!restaurant) return null;
    if (!restaurant.is_verified) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente de vérification</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Restaurant vérifié</span>;
  }, [restaurant]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-700">
          <RefreshCcw className="h-5 w-5 animate-spin" />
          <span>Chargement de votre espace restaurant...</span>
        </div>
      </div>
    );
  }

  if (restaurant) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Restaurant lié à votre compte</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{restaurant.name}</h1>
              <p className="text-gray-600 mt-1">{restaurant.address}</p>
              <div className="mt-3 flex flex-wrap gap-3 items-center text-sm text-gray-700">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {restaurant.phone}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  ID #{restaurant.id}
                </span>
                {statusBadge}
              </div>
            </div>
            {restaurant.is_open && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Restaurant ouvert
              </div>
            )}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs uppercase">Catégorie</p>
              <p className="font-medium text-gray-900 mt-1">{restaurant.cuisine_types?.[0] || 'Non précisée'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs uppercase">Email</p>
              <p className="font-medium text-gray-900 mt-1">{restaurant.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs uppercase">Créé le</p>
              <p className="font-medium text-gray-900 mt-1">{new Date(restaurant.created_at).toLocaleString('fr-FR')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs uppercase">Statut</p>
              <p className="font-medium text-gray-900 mt-1">{restaurant.is_verified ? 'Validé' : 'En revue'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-3xl mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600">Création de votre restaurant</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Reliez votre compte à un restaurant</h1>
            <p className="text-gray-600 mt-2">Les informations saisies seront enregistrées dans la table <strong>restaurants</strong>.</p>
          </div>
          <ScrollText className="h-10 w-10 text-orange-500" />
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du restaurant</label>
            <input
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Ex: Chez Fatou"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Quelques lignes sur votre cuisine"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              value={formData.address}
              onChange={(event) => setFormData({ ...formData, address: event.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Quartier, ville"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="+221 xx xxx xx xx"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="contact@restaurant.sn"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <input
                value={formData.category}
                onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Cuisine sénégalaise, fast-food..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Temps de livraison</label>
              <input
                value={formData.delivery_time}
                onChange={(event) => setFormData({ ...formData, delivery_time: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: 25-35 min"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Frais de livraison (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.delivery_fee}
                  onChange={(event) => setFormData({ ...formData, delivery_fee: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Commande min. (FCFA)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minimum_order}
                  onChange={(event) => setFormData({ ...formData, minimum_order: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 text-white rounded-lg py-3 font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Enregistrement...' : 'Enregistrer le restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantDashboard;