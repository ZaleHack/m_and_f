import React from 'react';
import { BarChart3, Users, Store, Truck, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    { 
      title: 'Commandes aujourd\'hui', 
      value: '156', 
      change: '+12%', 
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    { 
      title: 'Revenus du jour', 
      value: '847,250 FCFA', 
      change: '+8%', 
      icon: DollarSign,
      color: 'bg-green-500'
    },
    { 
      title: 'Restaurants actifs', 
      value: '23', 
      change: '+2', 
      icon: Store,
      color: 'bg-orange-500'
    },
    { 
      title: 'Livreurs en ligne', 
      value: '18', 
      change: '+5', 
      icon: Truck,
      color: 'bg-purple-500'
    },
  ];

  const recentOrders = [
    { id: '#12456', restaurant: 'Chez Fatou', client: 'Amadou Ba', amount: '12,500 FCFA', status: 'delivered', time: '14:30' },
    { id: '#12457', restaurant: 'Le Lagon', client: 'Aïssatou Diop', amount: '18,750 FCFA', status: 'in_delivery', time: '14:25' },
    { id: '#12458', restaurant: 'Baobab Resto', client: 'Moussa Fall', amount: '9,200 FCFA', status: 'preparing', time: '14:20' },
    { id: '#12459', restaurant: 'Teranga Food', client: 'Fatou Sene', amount: '15,300 FCFA', status: 'pending', time: '14:15' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_delivery': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livrée';
      case 'in_delivery': return 'En livraison';
      case 'preparing': return 'En préparation';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme M&F Eats</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs hier</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.restaurant} → {order.client}</p>
                    <p className="text-sm text-gray-500">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200">
              <div className="flex items-center space-x-3">
                <Store className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">Nouveau restaurant</span>
              </div>
              <span className="text-orange-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Gestion utilisateurs</span>
              </div>
              <span className="text-blue-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Rapports détaillés</span>
              </div>
              <span className="text-green-600">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;