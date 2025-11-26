import React, { useMemo, useState } from 'react';
import { CheckCircle2, Image, PlusCircle, ShieldCheck, XCircle } from 'lucide-react';

interface MenuRecord {
  id: number;
  restaurant_id: number;
  nom: string;
  description: string;
  prix: number;
  options?: string;
  photo?: string;
  actif: boolean;
}

interface MenuFormState {
  restaurant_id: string;
  nom: string;
  description: string;
  prix: string;
  options: string;
  photo: string;
  actif: boolean;
}

const MenuManagement: React.FC = () => {
  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [form, setForm] = useState<MenuFormState>({
    restaurant_id: '',
    nom: '',
    description: '',
    prix: '',
    options: '',
    photo: '',
    actif: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeCount = useMemo(() => menus.filter((menu) => menu.actif).length, [menus]);

  const resetForm = () => {
    setForm({ restaurant_id: '', nom: '', description: '', prix: '', options: '', photo: '', actif: true });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(null);

    if (!form.restaurant_id || !form.nom || !form.prix) {
      setError('Les champs `restaurant_id`, `nom` et `prix` de la table `menus` sont obligatoires.');
      return;
    }

    const restaurantId = Number(form.restaurant_id);
    const prix = Number(form.prix);
    if (Number.isNaN(restaurantId) || Number.isNaN(prix) || prix <= 0) {
      setError('`restaurant_id` et `prix` doivent être numériques et le prix doit être supérieur à 0.');
      return;
    }

    // Validate JSON options if provided
    if (form.options) {
      try {
        JSON.parse(form.options);
      } catch {
        setError('Le champ options doit contenir un JSON valide (conforme à la colonne `options`).');
        return;
      }
    }

    const newMenu: MenuRecord = {
      id: menus.length + 1,
      restaurant_id: restaurantId,
      nom: form.nom,
      description: form.description,
      prix,
      options: form.options || undefined,
      photo: form.photo || undefined,
      actif: form.actif,
    };

    setMenus((current) => [newMenu, ...current]);
    resetForm();
    setError(null);
    setSuccess('Plat enregistré conformément à la table `menus`.');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des menus</h1>
        <p className="text-gray-600">Créez des plats alignés sur la table MySQL `menus` (restaurant_id, nom, description, prix, options, photo, actif).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Plats total</p>
          <p className="text-2xl font-bold text-gray-900">{menus.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Plats actifs</p>
          <p className="text-2xl font-bold text-green-700">{activeCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Plats inactifs</p>
          <p className="text-2xl font-bold text-red-600">{menus.length - activeCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un plat</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant ID (`restaurant_id`)</label>
              <input
                type="number"
                min="1"
                value={form.restaurant_id}
                onChange={(event) => setForm({ ...form, restaurant_id: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Identifiant du restaurant"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom du plat</label>
              <input
                value={form.nom}
                onChange={(event) => setForm({ ...form, nom: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Ex: Thiéboudienne"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Détails du plat"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prix (colonne `prix`)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.prix}
                  onChange={(event) => setForm({ ...form, prix: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Actif</label>
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    checked={form.actif}
                    onChange={(event) => setForm({ ...form, actif: event.target.checked })}
                    className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Visible dans les commandes</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Options (JSON)</label>
              <textarea
                value={form.options}
                onChange={(event) => setForm({ ...form, options: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder='Ex: {"taille":"Grande","supplements":["Fromage"]}'
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Photo (URL)</label>
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-gray-400" />
                <input
                  value={form.photo}
                  onChange={(event) => setForm({ ...form, photo: event.target.value })}
                  className="flex-1 mt-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="https://..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white rounded-lg py-2.5 font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Enregistrer
            </button>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                <XCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                <CheckCircle2 className="h-4 w-4" />
                {success}
              </div>
            )}
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Menus alignés avec la base</p>
              <h3 className="text-lg font-semibold text-gray-900">Table `menus`</h3>
            </div>
            <ShieldCheck className="h-6 w-6 text-orange-500" />
          </div>

          {menus.length === 0 ? (
            <p className="text-sm text-gray-600">Aucun plat saisi pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Plat</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Restaurant</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Tarif</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {menus.map((menu) => (
                    <tr key={menu.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{menu.nom}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{menu.description || 'Description à compléter'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">#{menu.restaurant_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{menu.prix.toFixed(2)} FCFA</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${menu.actif ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {menu.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
