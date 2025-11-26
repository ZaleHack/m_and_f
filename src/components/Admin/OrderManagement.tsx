import React, { useMemo, useState } from 'react';
import { Banknote, CheckCircle2, ClipboardList, MapPin, Plus, Receipt, ShoppingBag, XCircle } from 'lucide-react';

interface CommandeDetailForm {
  menu_id: string;
  quantite: string;
  prix: string;
  options: string;
}

interface CommandeForm {
  client_id: string;
  restaurant_id: string;
  livreur_id: string;
  statut: 'acceptée' | 'préparation' | 'en livraison' | 'livrée' | 'annulée';
  mode_paiement: 'espèces' | 'wave' | 'orange_money';
  position_livreur: string;
  total: string;
  details: CommandeDetailForm[];
}

interface CommandeRecord {
  id: number;
  client_id: number;
  restaurant_id: number;
  livreur_id?: number;
  statut: CommandeForm['statut'];
  mode_paiement: CommandeForm['mode_paiement'];
  position_livreur?: string;
  total: number;
  date_commande: string;
  details: Array<CommandeDetailForm & { id: number }>;
}

interface TransactionForm {
  commande_id: string;
  montant: string;
  commission: string;
}

interface TransactionRecord {
  id: number;
  commande_id: number;
  montant: number;
  commission?: number;
  date_transaction: string;
}

const OrderManagement: React.FC = () => {
  const [commandes, setCommandes] = useState<CommandeRecord[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [commandeForm, setCommandeForm] = useState<CommandeForm>({
    client_id: '',
    restaurant_id: '',
    livreur_id: '',
    statut: 'acceptée',
    mode_paiement: 'espèces',
    position_livreur: '',
    total: '',
    details: [{ menu_id: '', quantite: '1', prix: '', options: '' }],
  });
  const [transactionForm, setTransactionForm] = useState<TransactionForm>({ commande_id: '', montant: '', commission: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalCommande = useMemo(() => commandes.reduce((sum, cmd) => sum + cmd.total, 0), [commandes]);

  const handleAddDetail = () => {
    setCommandeForm((current) => ({
      ...current,
      details: [...current.details, { menu_id: '', quantite: '1', prix: '', options: '' }],
    }));
  };

  const handleDetailChange = (index: number, key: keyof CommandeDetailForm, value: string) => {
    setCommandeForm((current) => {
      const updated = [...current.details];
      updated[index] = { ...updated[index], [key]: value };
      return { ...current, details: updated };
    });
  };

  const handleCommandeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(null);

    if (!commandeForm.client_id || !commandeForm.restaurant_id || !commandeForm.mode_paiement) {
      setError('Les colonnes `client_id`, `restaurant_id` et `mode_paiement` sont obligatoires dans `commandes`.');
      return;
    }

    const clientId = Number(commandeForm.client_id);
    const restaurantId = Number(commandeForm.restaurant_id);
    const livreurId = commandeForm.livreur_id ? Number(commandeForm.livreur_id) : undefined;

    if (Number.isNaN(clientId) || Number.isNaN(restaurantId) || (commandeForm.livreur_id && Number.isNaN(livreurId))) {
      setError('Les identifiants client, restaurant et livreur doivent être numériques.');
      return;
    }

    const parsedDetails = commandeForm.details.map((detail) => ({
      ...detail,
      quantite: detail.quantite || '1',
    }));

    let total = commandeForm.total ? Number(commandeForm.total) : 0;
    if (Number.isNaN(total)) {
      setError('Le total doit être un nombre valide.');
      return;
    }

    if (!commandeForm.total) {
      total = parsedDetails.reduce((sum, item) => sum + (Number(item.prix) || 0) * (Number(item.quantite) || 1), 0);
    }

    const newCommande: CommandeRecord = {
      id: commandes.length + 1,
      client_id: clientId,
      restaurant_id: restaurantId,
      livreur_id: livreurId,
      statut: commandeForm.statut,
      mode_paiement: commandeForm.mode_paiement,
      position_livreur: commandeForm.position_livreur || undefined,
      total,
      date_commande: new Date().toISOString(),
      details: parsedDetails.map((detail, index) => ({ ...detail, id: index + 1 })),
    };

    setCommandes((current) => [newCommande, ...current]);
    setCommandeForm({
      client_id: '',
      restaurant_id: '',
      livreur_id: '',
      statut: 'acceptée',
      mode_paiement: 'espèces',
      position_livreur: '',
      total: '',
      details: [{ menu_id: '', quantite: '1', prix: '', options: '' }],
    });
    setError(null);
    setSuccess('Commande enregistrée en respectant la structure `commandes` et `commande_details`.');
  };

  const handleTransactionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(null);

    if (!transactionForm.commande_id || !transactionForm.montant) {
      setError('`commande_id` et `montant` sont obligatoires pour la table `transactions`.');
      return;
    }

    const commandeId = Number(transactionForm.commande_id);
    const montant = Number(transactionForm.montant);
    const commission = transactionForm.commission ? Number(transactionForm.commission) : undefined;

    if (Number.isNaN(commandeId) || Number.isNaN(montant) || (transactionForm.commission && Number.isNaN(commission))) {
      setError('Les montants et identifiants doivent être numériques.');
      return;
    }

    const newTransaction: TransactionRecord = {
      id: transactions.length + 1,
      commande_id: commandeId,
      montant,
      commission,
      date_transaction: new Date().toISOString(),
    };

    setTransactions((current) => [newTransaction, ...current]);
    setTransactionForm({ commande_id: '', montant: '', commission: '' });
    setError(null);
    setSuccess('Transaction alignée sur la table `transactions` enregistrée.');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Commandes & Transactions</h1>
        <p className="text-gray-600">Formulaires alignés sur les tables MySQL `commandes`, `commande_details` et `transactions`.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Commandes</p>
          <p className="text-2xl font-bold text-gray-900">{commandes.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Chiffre total déclaré</p>
          <p className="text-2xl font-bold text-green-700">{totalCommande.toFixed(2)} FCFA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Créer une commande</h2>
              <p className="text-sm text-gray-600">Renseignez les colonnes `commandes` et les lignes `commande_details`.</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleCommandeSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Client ID (`client_id`)</label>
                <input
                  type="number"
                  min="1"
                  value={commandeForm.client_id}
                  onChange={(event) => setCommandeForm({ ...commandeForm, client_id: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="ID utilisateur client"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Restaurant ID (`restaurant_id`)</label>
                <input
                  type="number"
                  min="1"
                  value={commandeForm.restaurant_id}
                  onChange={(event) => setCommandeForm({ ...commandeForm, restaurant_id: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="ID du restaurant"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Livreur ID (`livreur_id`)</label>
                <input
                  type="number"
                  min="1"
                  value={commandeForm.livreur_id}
                  onChange={(event) => setCommandeForm({ ...commandeForm, livreur_id: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Optionnel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position livreur</label>
                <input
                  value={commandeForm.position_livreur}
                  onChange={(event) => setCommandeForm({ ...commandeForm, position_livreur: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Coordonnées GPS ou adresse"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut (`statut`)</label>
                <select
                  value={commandeForm.statut}
                  onChange={(event) => setCommandeForm({ ...commandeForm, statut: event.target.value as CommandeForm['statut'] })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                >
                  <option value="acceptée">Acceptée</option>
                  <option value="préparation">Préparation</option>
                  <option value="en livraison">En livraison</option>
                  <option value="livrée">Livrée</option>
                  <option value="annulée">Annulée</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mode de paiement</label>
                <select
                  value={commandeForm.mode_paiement}
                  onChange={(event) => setCommandeForm({ ...commandeForm, mode_paiement: event.target.value as CommandeForm['mode_paiement'] })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                >
                  <option value="espèces">Espèces</option>
                  <option value="wave">Wave</option>
                  <option value="orange_money">Orange Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total (auto-calcul si vide)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={commandeForm.total}
                  onChange={(event) => setCommandeForm({ ...commandeForm, total: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Somme des articles"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Articles (`commande_details`)</p>
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une ligne
                </button>
              </div>

              {commandeForm.details.map((detail, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Menu ID</label>
                    <input
                      type="number"
                      min="1"
                      value={detail.menu_id}
                      onChange={(event) => handleDetailChange(index, 'menu_id', event.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantité</label>
                    <input
                      type="number"
                      min="1"
                      value={detail.quantite}
                      onChange={(event) => handleDetailChange(index, 'quantite', event.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix unitaire</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={detail.prix}
                      onChange={(event) => handleDetailChange(index, 'prix', event.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    <input
                      value={detail.options}
                      onChange={(event) => handleDetailChange(index, 'options', event.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      placeholder="Sans oignon, boisson..."
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white rounded-lg py-2.5 font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardList className="h-4 w-4" />
              Enregistrer la commande
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Banknote className="h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Enregistrer une transaction</h2>
              <p className="text-sm text-gray-600">Colonne `transactions` (commande_id, montant, commission).</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleTransactionSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Commande ID</label>
                <input
                  type="number"
                  min="1"
                  value={transactionForm.commande_id}
                  onChange={(event) => setTransactionForm({ ...transactionForm, commande_id: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Référence commande"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Montant</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionForm.montant}
                  onChange={(event) => setTransactionForm({ ...transactionForm, montant: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  placeholder="Montant débité"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Commission (optionnelle)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={transactionForm.commission}
                onChange={(event) => setTransactionForm({ ...transactionForm, commission: event.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                placeholder="Frais plateforme"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white rounded-lg py-2.5 font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              Enregistrer la transaction
            </button>
          </form>
        </div>
      </div>

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes enregistrées</h3>
          {commandes.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune commande pour l'instant.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Référence</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Client / Restaurant</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commandes.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="font-semibold text-gray-900">#{cmd.id}</div>
                        <div className="text-xs text-gray-500">{cmd.date_commande}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Client #{cmd.client_id}<br />Restaurant #{cmd.restaurant_id}
                        {cmd.livreur_id && (
                          <div className="text-xs text-gray-500">Livreur #{cmd.livreur_id}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cmd.total.toFixed(2)} FCFA</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <MapPin className="h-3 w-3" />
                          {cmd.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-600">Aucune transaction enregistrée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Référence</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Commande</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Montant</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">TX-{transaction.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">Commande #{transaction.commande_id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{transaction.montant.toFixed(2)} FCFA</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{transaction.commission?.toFixed(2) ?? '0.00'} FCFA</td>
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

export default OrderManagement;
