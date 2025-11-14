import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesGrid from './components/ServicesGrid';
import Footer from './components/Footer';
import DashboardLayout from './components/dashboard/DashboardLayout';
import CustomerDashboard from './components/dashboard/CustomerDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import type { UserRole, Client, Ticket, Asset } from './types';
import { clients as mockClients, tickets as mockTickets, assets as mockAssets } from './data/mockData';


type AppView = 'home' | 'login' | 'signup';

// --- Configuration ---
const TEAM_WHATSAPP_NUMBER = '61481943940'; // Use number without '+' for the wa.me link
const CONTACT_FORM_EMAIL_TARGET = 'support@peres.systems';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Centralized State Management - using mock data
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [guidesByAssetModel, setGuidesByAssetModel] = useState<Record<string, { name: string, content: string }>>({});
  const [isUploadingGuideForModel, setIsUploadingGuideForModel] = useState<string | null>(null);

  // Check for saved session on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);
  
  // --- State-based CRUD Operations ---
  // Clients
  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
        ...client,
        id: `c${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
    };
    setClients(prev => [newClient, ...prev]);
  };
  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    // Also delete associated tickets and assets for data consistency
    setTickets(prev => prev.filter(t => t.clientId !== clientId));
    setAssets(prev => prev.filter(a => a.clientId !== clientId));
  };

  // Tickets
  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket: Ticket = {
        ...ticket,
        id: `t${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
    };
    setTickets(prev => [newTicket, ...prev]);
  };
  const updateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };
  const deleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  // Assets
  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
        ...asset,
        id: `a${Date.now()}`,
    };
    setAssets(prev => [newAsset, ...prev]);
  };
  const updateAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };
  const deleteAsset = (assetId: string) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
  };
  
  // AI Assistant (client-side file handling)
  const handleGuideUpload = (assetName: string, file: File) => {
      setIsUploadingGuideForModel(assetName);
      const reader = new FileReader();
      reader.onload = (event) => {
          const textContent = event.target?.result as string;
          setGuidesByAssetModel(prev => ({
              ...prev,
              [assetName]: { name: file.name, content: textContent }
          }));
          setIsUploadingGuideForModel(null);
      };
      reader.onerror = () => {
          console.error("Failed to read file.");
          alert("Sorry, there was an error reading the file. Please try again.");
          setIsUploadingGuideForModel(null);
      }
      reader.readAsText(file);
  };


  const handleLogin = (role: UserRole) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
    setView('home'); // Redirect to home/dashboard view after login
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    setView('home');
  };

  const handleSignUp = (newClientData: Omit<Client, 'id' | 'createdAt'>) => {
    addClient(newClientData);
    // In a real app, successful creation would lead to login,
    // but here we just simulate it after the add attempt.
    handleLogin('customer');
  };

  if (isAuthenticated && userRole) {
    if (userRole === 'team') {
       return <DashboardLayout 
                onLogout={handleLogout}
                clients={clients}
                tickets={tickets}
                assets={assets}
                guidesByAssetModel={guidesByAssetModel}
                isUploadingGuideForModel={isUploadingGuideForModel}
                onAddClient={addClient}
                onUpdateClient={updateClient}
                onDeleteClient={deleteClient}
                onAddTicket={addTicket}
                onUpdateTicket={updateTicket}
                onDeleteTicket={deleteTicket}
                onAddAsset={addAsset}
                onUpdateAsset={updateAsset}
                onDeleteAsset={deleteAsset}
                onGuideUpload={handleGuideUpload}
            />;
    }
    return <CustomerDashboard 
              onLogout={handleLogout} 
              clients={clients}
              tickets={tickets}
              assets={assets}
              onAddTicket={addTicket}
              teamWhatsAppNumber={TEAM_WHATSAPP_NUMBER}
              contactFormEmailTarget={CONTACT_FORM_EMAIL_TARGET}
            />;
  }

  const renderView = () => {
    switch(view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setView('signup')} />;
      case 'signup':
        return <SignupPage onSignUp={handleSignUp} onNavigateToLogin={() => setView('login')} />;
      case 'home':
      default:
        return (
          <>
            <HeroSection />
            <ServicesGrid />
          </>
        );
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-light dark:bg-neutral-darker">
      <Header 
        isAuthenticated={isAuthenticated}
        onLoginClick={() => setView('login')}
        onLogoutClick={handleLogout} 
      />
      <main className="flex-grow">
          {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
