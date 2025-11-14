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
import { PeresSystemsLogo } from './components/icons';


type AppView = 'home' | 'login' | 'signup';

// --- Configuration ---
const TEAM_WHATSAPP_NUMBER = '61481943940'; // Use number without '+' for the wa.me link
const CONTACT_FORM_EMAIL_TARGET = 'support@peres.systems';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // --- API-driven State Management ---
  const [clients, setClients] = useState<Client[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [guidesByAssetModel, setGuidesByAssetModel] = useState<Record<string, { name: string, content: string }>>({});
  const [isUploadingGuideForModel, setIsUploadingGuideForModel] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved session on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);
  
  // Fetch initial data from API on load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [clientsRes, ticketsRes, assetsRes] = await Promise.all([
          fetch('/api/clients/'),
          fetch('/api/tickets/'),
          fetch('/api/assets/')
        ]);

        if (!clientsRes.ok || !ticketsRes.ok || !assetsRes.ok) {
          throw new Error('Network response was not ok');
        }

        const clientsData = await clientsRes.json();
        const ticketsData = await ticketsRes.json();
        const assetsData = await assetsRes.json();

        setClients(clientsData);
        setTickets(ticketsData);
        setAssets(assetsData);

      } catch (err) {
        setError('Failed to fetch initial data. Please ensure the backend server is running and the API endpoints (/api/clients/, /api/tickets/, /api/assets/) are available.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  
  // --- API-based CRUD Operations ---
  // Clients
  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> => {
    try {
        const response = await fetch('/api/clients/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(client),
        });
        if (!response.ok) throw new Error('Failed to add client');
        const newClient = await response.json();
        setClients(prev => [newClient, ...prev]);
        return newClient;
    } catch (err) {
        console.error(err);
        alert('Error: Could not add client.');
        return null;
    }
  };
  const updateClient = async (updatedClient: Client) => {
    try {
        const response = await fetch(`/api/clients/${updatedClient.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedClient),
        });
        if (!response.ok) throw new Error('Failed to update client');
        const returnedClient = await response.json();
        setClients(prev => prev.map(c => c.id === returnedClient.id ? returnedClient : c));
    } catch (err) {
        console.error(err);
        alert('Error: Could not update client.');
    }
  };
  const deleteClient = async (clientId: string) => {
    try {
        const response = await fetch(`/api/clients/${clientId}/`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete client');
        setClients(prev => prev.filter(c => c.id !== clientId));
        // Backend should handle cascading deletes. Optimistically remove from frontend.
        setTickets(prev => prev.filter(t => t.clientId !== clientId));
        setAssets(prev => prev.filter(a => a.clientId !== clientId));
    } catch (err) {
        console.error(err);
        alert('Error: Could not delete client.');
    }
  };

  // Tickets
  const addTicket = async (ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
     try {
        const response = await fetch('/api/tickets/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket),
        });
        if (!response.ok) throw new Error('Failed to create ticket');
        const newTicket = await response.json();
        setTickets(prev => [newTicket, ...prev]);
    } catch (err) {
        console.error(err);
        alert('Error: Could not create ticket.');
    }
  };
  const updateTicket = async (updatedTicket: Ticket) => {
    try {
        const response = await fetch(`/api/tickets/${updatedTicket.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTicket),
        });
        if (!response.ok) throw new Error('Failed to update ticket');
        const returnedTicket = await response.json();
        setTickets(prev => prev.map(t => t.id === returnedTicket.id ? returnedTicket : t));
    } catch (err) {
        console.error(err);
        alert('Error: Could not update ticket.');
    }
  };
  const deleteTicket = async (ticketId: string) => {
    try {
        const response = await fetch(`/api/tickets/${ticketId}/`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete ticket');
        setTickets(prev => prev.filter(t => t.id !== ticketId));
    } catch (err) {
        console.error(err);
        alert('Error: Could not delete ticket.');
    }
  };

  // Assets
  const addAsset = async (asset: Omit<Asset, 'id'>) => {
    try {
        const response = await fetch('/api/assets/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset),
        });
        if (!response.ok) throw new Error('Failed to add asset');
        const newAsset = await response.json();
        setAssets(prev => [newAsset, ...prev]);
    } catch (err) {
        console.error(err);
        alert('Error: Could not add asset.');
    }
  };
  const updateAsset = async (updatedAsset: Asset) => {
    try {
        const response = await fetch(`/api/assets/${updatedAsset.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAsset),
        });
        if (!response.ok) throw new Error('Failed to update asset');
        const returnedAsset = await response.json();
        setAssets(prev => prev.map(a => a.id === returnedAsset.id ? returnedAsset : a));
    } catch (err) {
        console.error(err);
        alert('Error: Could not update asset.');
    }
  };
  const deleteAsset = async (assetId: string) => {
     try {
        const response = await fetch(`/api/assets/${assetId}/`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete asset');
        setAssets(prev => prev.filter(a => a.id !== assetId));
    } catch (err) {
        console.error(err);
        alert('Error: Could not delete asset.');
    }
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

  const handleSignUp = async (newClientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = await addClient(newClientData);
    if (newClient) {
      // In a real app, successful creation would lead to login,
      // but here we just simulate it after the add attempt.
      handleLogin('customer');
    }
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-darker text-white">
            <PeresSystemsLogo className="h-20 w-auto mb-8 animate-pulse" />
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-300"></div>
            </div>
            <p className="mt-4 text-lg">Loading Application Data...</p>
        </div>
    );
  }

  if (error) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-darker text-white p-8">
            <div className="max-w-2xl text-center bg-neutral-dark p-10 rounded-lg shadow-2xl border border-red-500/50">
                <h1 className="text-3xl font-bold text-red-400 mb-4">Connection Error</h1>
                <p className="text-lg text-gray-300 mb-6">{error}</p>
                <code className="block bg-neutral-darker text-left p-4 rounded-md text-gray-400 text-sm whitespace-pre-wrap">
                  {`# To fix this:
1. Navigate to your backend project directory.
2. Start your Django development server:
   python manage.py runserver
3. Refresh this page.`}
                </code>
            </div>
        </div>
    );
  }

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
