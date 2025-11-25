import React from 'react';
import { 
  Home, Store, Truck, Users, ShoppingBag, 
  BarChart3, Settings, MapPin, CreditCard,
  UtensilsCrossed, Package
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.tsx';

interface SidebarProps {
  isOpen: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, onViewChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: Home },
          { id: 'restaurants', label: 'Restaurants', icon: Store },
          { id: 'livreurs', label: 'Livreurs', icon: Truck },
          { id: 'clients', label: 'Clients', icon: Users },
          { id: 'commandes', label: 'Commandes', icon: ShoppingBag },
          { id: 'analytics', label: 'Analytiques', icon: BarChart3 },
          { id: 'settings', label: 'Paramètres', icon: Settings },
        ];
      case 'restaurant':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: Home },
          { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
          { id: 'commandes', label: 'Commandes', icon: ShoppingBag },
          { id: 'livreurs', label: 'Mes livreurs', icon: Truck },
          { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
          { id: 'profile', label: 'Mon profil', icon: Store },
        ];
      case 'livreur':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: Home },
          { id: 'livraisons', label: 'Livraisons', icon: Package },
          { id: 'map', label: 'Carte', icon: MapPin },
          { id: 'earnings', label: 'Gains', icon: CreditCard },
          { id: 'profile', label: 'Mon profil', icon: Users },
        ];
      case 'client':
        return [
          { id: 'restaurants', label: 'Restaurants', icon: Store },
          { id: 'commandes', label: 'Mes commandes', icon: ShoppingBag },
          { id: 'favoris', label: 'Favoris', icon: Home },
          { id: 'profile', label: 'Mon profil', icon: Users },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:top-0 md:h-full
        w-64
      `}>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left
                  ${isActive 
                    ? 'bg-orange-100 text-orange-700 border border-orange-200 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-orange-600' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;