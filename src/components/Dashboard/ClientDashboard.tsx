import React, { useState } from 'react';
import { Star, Clock, MapPin, Search, Filter } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  category: string;
  isOpen: boolean;
  description: string;
}

const ClientDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Chez Fatou',
      image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 1500,
      category: 'Sénégalais',
      isOpen: true,
      description: 'Cuisine traditionnelle sénégalaise authentique'
    },
    {
      id: '2',
      name: 'Le Lagon',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
      rating: 4.6,
      deliveryTime: '30-40 min',
      deliveryFee: 2000,
      category: 'Français',
      isOpen: true,
      description: 'Cuisine française raffinée avec vue sur mer'
    },
    {
      id: '3',
      name: 'Baobab Resto',
      image: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg',
      rating: 4.5,
      deliveryTime: '20-30 min',
      deliveryFee: 1000,
      category: 'Fast Food',
      isOpen: false,
      description: 'Burgers et grillades dans un cadre moderne'
    },
    {
      id: '4',
      name: 'Teranga Food',
      image: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
      rating: 4.7,
      deliveryTime: '25-35 min',
      deliveryFee: 1500,
      category: 'Sénégalais',
      isOpen: true,
      description: 'Spécialités locales et plats du terroir'
    },
    {
      id: '5',
      name: 'Pizza Corner',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
      rating: 4.4,
      deliveryTime: '35-45 min',
      deliveryFee: 1800,
      category: 'Italien',
      isOpen: true,
      description: 'Pizzas artisanales et pâtes fraîches'
    },
    {
      id: '6',
      name: 'Sushi Zen',
      image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg',
      rating: 4.9,
      deliveryTime: '40-50 min',
      deliveryFee: 2500,
      category: 'Japonais',
      isOpen: true,
      description: 'Sushi frais et cuisine japonaise authentique'
    }
  ];

  const categories = ['all', 'Sénégalais', 'Français', 'Fast Food', 'Italien', 'Japonais'];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || restaurant.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Restaurants disponibles</h1>
        <p className="text-gray-600 mt-1">Découvrez les meilleurs restaurants près de chez vous</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un restaurant ou un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
          >
            <option value="all">Toutes les cuisines</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
              !restaurant.isOpen ? 'opacity-75' : ''
            }`}
          >
            <div className="relative">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  restaurant.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {restaurant.isOpen ? 'Ouvert' : 'Fermé'}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{restaurant.description}</p>
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs mt-2">
                    {restaurant.category}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">{restaurant.rating}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.deliveryFee.toLocaleString()} FCFA</span>
                </div>
              </div>

              <button
                className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
                  restaurant.isOpen
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!restaurant.isOpen}
              >
                {restaurant.isOpen ? 'Voir le menu' : 'Restaurant fermé'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Aucun restaurant trouvé</h3>
          <p className="text-gray-600 mt-1">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;