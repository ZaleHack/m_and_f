import React, { useEffect, useState } from 'react';
import { ScrollText, Building2, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { createRestaurant, fetchRestaurants, RestaurantRecord } from '../../services/restaurants';

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    adresse: '',
  });

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const entries = await fetchRestaurants();
        const mine = entries.find((entry) => String(entry.utilisateur_id) === String(user.id));
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
        utilisateur_id: Number(user.id),
        nom: formData.nom,
        description: formData.description || undefined,
        adresse: formData.adresse,
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center gap-3 text-gray-700">
          <span className="h-5 w-5 animate-spin border-2 border-orange-500 border-t-transparent rounded-full" />
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
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{restaurant.nom}</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                {restaurant.adresse}
              </p>
              <div className="mt-3 flex flex-wrap gap-3 items-center text-sm text-gray-700">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  ID #{restaurant.id}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  Utilisateur #{restaurant.utilisateur_id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              Restaurant enregistré
            </div>
          </div>
          {restaurant.description && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-gray-700">
              {restaurant.description}
            </div>
          )}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs uppercase">Créé le</p>
              <p className="font-medium text-gray-900 mt-1">{new Date(restaurant.created_at).toLocaleString('fr-FR')}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs uppercase">Dernière mise à jour</p>
              <p className="font-medium text-gray-900 mt-1">{new Date(restaurant.updated_at).toLocaleString('fr-FR')}</p>
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
            <p className="text-gray-600 mt-2">Les informations saisies seront enregistrées dans la table <strong>restaurants</strong> (colonnes nom, adresse, description).</p>
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
            <label className="block text-sm font-medium text-gray-700">Nom du restaurant (colonne `nom`)</label>
            <input
              value={formData.nom}
              onChange={(event) => setFormData({ ...formData, nom: event.target.value })}
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
            <label className="block text-sm font-medium text-gray-700">Adresse (colonne `adresse`)</label>
            <input
              value={formData.adresse}
              onChange={(event) => setFormData({ ...formData, adresse: event.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              placeholder="Quartier, ville"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer le restaurant'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
