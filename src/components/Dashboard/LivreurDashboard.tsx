import React from 'react';
import { MapPin, Clock, DollarSign, Star, CheckCircle, Package, Navigation } from 'lucide-react';

const LivreurDashboard: React.FC = () => {
  const stats = [
    { title: 'Livraisons aujourd\'hui', value: '8', change: '+2', icon: Package },
    { title: 'Gains du jour', value: '24,000 FCFA', change: '+15%', icon: DollarSign },
    { title: 'Note moyenne', value: '4.9', change: '+0.1', icon: Star },
    { title: 'Temps moyen', value: '22 min', change: '-5 min', icon: Clock },
  ];

  const availableDeliveries = [
    {
      id: '#12460',
      restaurant: 'Chez Fatou',
      address: 'Plateau, Dakar',
      distance: '2.3 km',
      earnings: '3,500 FCFA',
      preparationTime: '15 min',
      priority: 'high'
    },
    {
      id: '#12461',
      restaurant: 'Le Lagon',
      address: 'Almadies, Dakar',
      distance: '4.1 km',
      earnings: '4,200 FCFA',
      preparationTime: '10 min',
      priority: 'medium'
    },
    {
      id: '#12462',
      restaurant: 'Teranga Food',
      address: 'Médina, Dakar',
      distance: '1.8 km',
      earnings: '2,800 FCFA',
      preparationTime: '20 min',
      priority: 'low'
    }
  ];

  const activeDelivery = {
    id: '#12459',
    restaurant: 'Baobab Resto',
    customer: 'Aminata Sy',
    address: 'Point E, Dakar',
    phone: '+221 77 123 45 67',
    total: '15,300 FCFA',
    earnings: '3,800 FCFA',
    status: 'picked_up'
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Urgent';
      case 'medium': return 'Normal';
      case 'low': return 'Flexible';
      default: return priority;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord livreur</h1>
          <p className="text-gray-600 mt-1">Gérez vos livraisons en temps réel</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">En ligne</span>
          </div>
        </div>
      </div>

      {/* Stats */}
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
                <Icon className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-sm text-green-600 mt-2">{stat.change} vs hier</p>
            </div>
          );
        })}
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-orange-900">Livraison en cours</h3>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Récupérée
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informations de livraison</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Commande:</span> {activeDelivery.id}</p>
                <p><span className="font-medium">Restaurant:</span> {activeDelivery.restaurant}</p>
                <p><span className="font-medium">Client:</span> {activeDelivery.customer}</p>
                <p><span className="font-medium">Téléphone:</span> {activeDelivery.phone}</p>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{activeDelivery.address}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Détails financiers</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Total commande:</span> {activeDelivery.total}</p>
                <p><span className="font-medium">Vos gains:</span> <span className="text-green-600 font-semibold">{activeDelivery.earnings}</span></p>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                  <CheckCircle className="h-4 w-4" />
                  <span>Livré</span>
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Deliveries */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Livraisons disponibles</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {availableDeliveries.map((delivery) => (
            <div key={delivery.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{delivery.id}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(delivery.priority)}`}>
                        {getPriorityText(delivery.priority)}
                      </span>
                    </div>
                    <p className="font-semibold text-green-600">{delivery.earnings}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{delivery.restaurant}</p>
                        <p>{delivery.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Navigation className="h-4 w-4" />
                      <span>{delivery.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Prêt dans {delivery.preparationTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-3">
                <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg font-medium transition-colors">
                  Accepter
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LivreurDashboard;