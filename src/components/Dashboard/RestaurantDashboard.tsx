import React from 'react';
import { Plus, Eye, Edit2, Trash2, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const RestaurantDashboard: React.FC = () => {
  const stats = [
    { title: 'Commandes aujourd\'hui', value: '23', change: '+15%', color: 'text-blue-600' },
    { title: 'Revenus du jour', value: '147,500 FCFA', change: '+8%', color: 'text-green-600' },
    { title: 'Note moyenne', value: '4.8', change: '+0.2', color: 'text-yellow-600' },
    { title: 'Temps moyen', value: '28 min', change: '-3 min', color: 'text-purple-600' },
  ];

  const recentOrders = [
    { id: '#12456', client: 'Amadou Ba', items: 2, total: '12,500 FCFA', status: 'preparing', time: '14:30' },
    { id: '#12457', client: 'Aïssatou Diop', items: 3, total: '18,750 FCFA', status: 'ready', time: '14:25' },
    { id: '#12458', client: 'Moussa Fall', items: 1, total: '9,200 FCFA', status: 'pending', time: '14:20' },
  ];

  const popularItems = [
    { name: 'Thiéboudienne', orders: 45, revenue: '112,500 FCFA' },
    { name: 'Yassa Poulet', orders: 32, revenue: '96,000 FCFA' },
    { name: 'Mafé', orders: 28, revenue: '84,000 FCFA' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'pending': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Prêt';
      case 'preparing': return 'En préparation';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord restaurant</h1>
          <p className="text-gray-600 mt-1">Gérez votre restaurant Chez Fatou</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Nouveau plat</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <TrendingUp className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className={`text-sm ${stat.color} mt-2`}>{stat.change} vs hier</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      {getStatusIcon(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">{order.client} • {order.items} articles</p>
                    <p className="text-sm text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.total}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Accepter
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Refuser
                  </button>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Plats populaires</h3>
          </div>
          <div className="p-6 space-y-4">
            {popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.orders} commandes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.revenue}</p>
                  <div className="flex space-x-1 mt-1">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;