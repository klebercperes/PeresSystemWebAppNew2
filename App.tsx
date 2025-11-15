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
import { authService } from './services/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://peres.systems';

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

  // Helper function to make authenticated API calls
  const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const token = authService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      authService.logout();
      setIsAuthenticated(false);
      setUserRole(null);
      setView('login');
      throw new Error('Session expired. Please login again.');
    }

    return response;
  };

  // Check for saved session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        // Verify token is still valid by fetching user info
        const user = await authService.getCurrentUser();
        if (user) {
          // Use role from user object, not localStorage
          const role: UserRole = (user.role === 'team' ? 'team' : 'customer') as UserRole;
          setIsAuthenticated(true);
          setUserRole(role);
          // Update localStorage to match
          localStorage.setItem('userRole', role);
        } else {
          // Token invalid, clear auth
          authService.logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);
  
  // Fetch initial data from API only after authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [clientsRes, ticketsRes, assetsRes] = await Promise.all([
          apiCall('/api/clients'),
          apiCall('/api/tickets'),
          apiCall('/api/assets')
        ]);

        if (!clientsRes.ok || !ticketsRes.ok || !assetsRes.ok) {
          throw new Error('Network response was not ok');
        }

        const clientsData = await clientsRes.json();
        const ticketsDataRaw = await ticketsRes.json();
        const assetsData = await assetsRes.json();

        // Map backend tickets (title) to frontend tickets (subject)
        const ticketsData: Ticket[] = ticketsDataRaw.map((t: any) => ({
            id: t.id,
            subject: t.title, // Map title to subject
            clientId: t.clientId,
            contact: t.contact || { name: '', email: '', phone: '' }, // Default if missing
            assetId: t.assetId,
            status: t.status,
            description: t.description,
            notes: t.notes,
            attachments: t.attachments,
            createdAt: t.createdDate || new Date().toISOString(),
        }));

        setClients(clientsData);
        setTickets(ticketsData);
        setAssets(assetsData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch initial data. Please ensure the backend server is running and the API endpoints are available.';
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [isAuthenticated]);

  
  // --- API-based CRUD Operations ---
  // Clients
  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> => {
    try {
        const response = await apiCall('/api/clients', {
            method: 'POST',
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
        const response = await apiCall(`/api/clients/${updatedClient.id}`, {
            method: 'PUT',
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
        const response = await apiCall(`/api/clients/${clientId}`, { method: 'DELETE' });
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
        // Map frontend Ticket (subject) to backend API (title)
        const apiTicket = {
            clientId: ticket.clientId,
            title: ticket.subject, // Map subject to title for backend
            description: ticket.description,
            status: ticket.status,
        };
        
        const response = await apiCall('/api/tickets', {
            method: 'POST',
            body: JSON.stringify(apiTicket),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Failed to create ticket' }));
            throw new Error(errorData.detail || 'Failed to create ticket');
        }
        const backendTicket = await response.json();
        
        // Map backend response (title) back to frontend Ticket (subject)
        const frontendTicket: Ticket = {
            id: backendTicket.id,
            subject: backendTicket.title, // Map title back to subject
            clientId: backendTicket.clientId,
            contact: ticket.contact, // Keep original contact info
            assetId: ticket.assetId,
            status: backendTicket.status,
            description: backendTicket.description,
            createdAt: backendTicket.createdDate,
        };
        
        setTickets(prev => [frontendTicket, ...prev]);
    } catch (err) {
        console.error('Error creating ticket:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error: Could not create ticket.';
        alert(errorMessage);
    }
  };
  const updateTicket = async (updatedTicket: Ticket) => {
    try {
        // Map frontend Ticket (subject) to backend API (title)
        const apiTicket = {
            clientId: updatedTicket.clientId,
            title: updatedTicket.subject, // Map subject to title
            description: updatedTicket.description,
            status: updatedTicket.status,
        };
        
        const response = await apiCall(`/api/tickets/${updatedTicket.id}`, {
            method: 'PUT',
            body: JSON.stringify(apiTicket),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Failed to update ticket' }));
            throw new Error(errorData.detail || 'Failed to update ticket');
        }
        const backendTicket = await response.json();
        
        // Map backend response (title) back to frontend Ticket (subject)
        const frontendTicket: Ticket = {
            ...updatedTicket,
            subject: backendTicket.title, // Map title back to subject
            status: backendTicket.status,
            description: backendTicket.description,
        };
        
        setTickets(prev => prev.map(t => t.id === frontendTicket.id ? frontendTicket : t));
    } catch (err) {
        console.error('Error updating ticket:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error: Could not update ticket.';
        alert(errorMessage);
    }
  };
  const deleteTicket = async (ticketId: string) => {
    try {
        const response = await apiCall(`/api/tickets/${ticketId}`, { method: 'DELETE' });
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
        const response = await apiCall('/api/assets', {
            method: 'POST',
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
        const response = await apiCall(`/api/assets/${updatedAsset.id}`, {
            method: 'PUT',
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
        const response = await apiCall(`/api/assets/${assetId}`, { method: 'DELETE' });
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


  const handleLogin = (role: UserRole, token: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setView('home'); // Redirect to home/dashboard view after login
    // Token is already stored by authService.login()
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setView('home');
    // Clear data on logout
    setClients([]);
    setTickets([]);
    setAssets([]);
  };

  const handleSignUp = async (newClientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = await addClient(newClientData);
    if (newClient) {
      // In a real app, successful creation would lead to login,
      // but here we just simulate it after the add attempt.
      // Note: Signup should probably call /api/auth/register instead
      handleLogin('customer', '');
    }
  };

  if (isLoading && !isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-darker text-white">
            <PeresSystemsLogo className="h-20 w-auto mb-8 animate-pulse" />
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-150"></div>
                <div className="w-4 h-4 bg-primary rounded-full animate-bounce delay-300"></div>
            </div>
            <p className="mt-4 text-lg">Loading...</p>
        </div>
    );
  }

  if (error && isAuthenticated) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-darker text-white p-8">
            <div className="max-w-2xl text-center bg-neutral-dark p-10 rounded-lg shadow-2xl border border-red-500/50">
                <h1 className="text-3xl font-bold text-red-400 mb-4">Connection Error</h1>
                <p className="text-lg text-gray-300 mb-6">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-md"
                >
                  Retry
                </button>
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
