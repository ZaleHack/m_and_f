import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LoginForm from './components/Auth/LoginForm';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ClientDashboard from './components/Dashboard/ClientDashboard';
import RestaurantDashboard from './components/Dashboard/RestaurantDashboard';
import LivreurDashboard from './components/Dashboard/LivreurDashboard';
import RestaurantManagement from './components/Admin/RestaurantManagement';
import LivreurManagement from './components/Admin/LivreurManagement';
import UserManagement from './components/Admin/UserManagement';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    switch (user?.role) {
      case 'admin': return 'dashboard';
      case 'restaurant': return 'dashboard';
      case 'livreur': return 'dashboard';
      case 'client': return 'restaurants';
      default: return 'dashboard';
    }
  });

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M&F</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderMainContent = () => {
    switch (user.role) {
      case 'admin':
        switch (activeView) {
          case 'dashboard': return <AdminDashboard />;
          case 'restaurants': return <RestaurantManagement />;
          case 'livreurs': return <LivreurManagement />;
          case 'users': return <UserManagement />;
          case 'commandes': return <div className="p-6">Toutes les commandes</div>;
          case 'analytics': return <div className="p-6">Rapports et analytiques</div>;
          case 'settings': return <div className="p-6">Paramètres système</div>;
          default: return <AdminDashboard />;
        }
      
      case 'restaurant':
        switch (activeView) {
          case 'dashboard': return <RestaurantDashboard />;
          case 'menu': return <div className="p-6">Gestion du menu</div>;
          case 'commandes': return <div className="p-6">Commandes restaurant</div>;
          case 'livreurs': return <div className="p-6">Mes livreurs partenaires</div>;
          case 'analytics': return <div className="p-6">Statistiques restaurant</div>;
          case 'profile': return <div className="p-6">Profil restaurant</div>;
          default: return <RestaurantDashboard />;
        }
      
      case 'livreur':
        switch (activeView) {
          case 'dashboard': return <LivreurDashboard />;
          case 'livraisons': return <div className="p-6">Historique des livraisons</div>;
          case 'map': return <div className="p-6">Carte et navigation</div>;
          case 'earnings': return <div className="p-6">Mes gains</div>;
          case 'profile': return <div className="p-6">Mon profil livreur</div>;
          default: return <LivreurDashboard />;
        }
      
      case 'client':
        switch (activeView) {
          case 'restaurants': return <ClientDashboard />;
          case 'commandes': return <div className="p-6">Mes commandes</div>;
          case 'favoris': return <div className="p-6">Mes restaurants favoris</div>;
          case 'profile': return <div className="p-6">Mon profil</div>;
          default: return <ClientDashboard />;
        }
      
      default:
        return <div className="p-6">Vue non disponible</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={handleMenuToggle} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          activeView={activeView}
          onViewChange={handleViewChange}
        />
        
        <main className="flex-1 md:ml-64">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;