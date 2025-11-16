import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClientManager } from './components/ClientManager';
import { TicketManager } from './components/TicketManager';
import { AssetManager } from './components/AssetManager';
import { AiAssistant } from './components/AiAssistant';
import { UserManager } from './components/UserManager';
import { Login } from './components/Login';
import HomePage from './components/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import { api } from './services/api';
import { authService, User } from './services/auth';
import { View, Client, Ticket, Asset } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [clients, setClients] = useState<Client[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'services' | 'contact'>('home');

  const refreshUserData = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        // Only update if the user data actually changed to avoid unnecessary re-renders
        setCurrentUser(prevUser => {
          if (prevUser?.full_name !== user.full_name || 
              prevUser?.username !== user.username ||
              prevUser?.email !== user.email) {
            return { ...user }; // Create new object to force React re-render
          }
          return prevUser; // No change, keep existing
        });
      }
    } catch (err) {
      // Silently ignore errors - don't spam console or break the app
      // Rate limiting or network errors are expected occasionally
    }
  };

  const refreshData = async (showLoading: boolean = true, showErrors: boolean = true, includeUser: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      if (showErrors) {
        setError(null);
      }
      const [clientsData, ticketsData, assetsData] = await Promise.all([
        api.getClients(),
        api.getTickets(),
        api.getAssets(),
      ]);
      // Force state update by creating new array references
      setClients([...clientsData]);
      setTickets([...ticketsData]);
      setAssets([...assetsData]);
      setLastRefresh(new Date());
      
      // Only refresh user data if explicitly requested (to avoid rate limiting)
      if (includeUser) {
        await refreshUserData();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      console.error('Error refreshing data:', err);
      // Only show error if this is a user-initiated refresh with error display enabled
      if (showErrors) {
        setError(errorMessage);
      }
      // Make sure loading is set to false even on error
      if (showLoading) {
        setLoading(false);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Verify token is still valid and get fresh user data
          const user = await authService.getCurrentUser();
          if (user) {
            setIsAuthenticated(true);
            setCurrentUser(user);
            // Don't wait for refreshData - let it load in background
            // Don't include user refresh here to avoid duplicate calls
            refreshData(true, true, false).catch(err => {
              console.error('Error refreshing data:', err);
              setError('Failed to load data. Please refresh the page.');
              setLoading(false);
            });
          } else {
            authService.logout();
            setIsAuthenticated(false);
            setLoading(false);
          }
        } catch (err) {
          // Token invalid, clear auth
          authService.logout();
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // Auto-refresh data every 2 minutes to pick up admin updates (silent background refresh)
  // Only refresh if we have data loaded (to avoid errors on initial load)
  // Using 2 minutes to avoid rate limiting (AUTH_RATE_LIMIT is typically 5/minute)
  useEffect(() => {
    if (!isAuthenticated || clients.length === 0) return;

    const intervalId = setInterval(() => {
      // Silent background refresh - don't show loading or errors
      // Don't refresh user data on every cycle to avoid rate limiting
      refreshData(false, false, false).catch(() => {
        // Silently ignore errors during background refresh
      });
    }, 120000); // Refresh every 2 minutes to avoid rate limiting

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, clients.length]);

  // Separate interval for user data refresh (every 3 minutes to avoid rate limiting)
  useEffect(() => {
    if (!isAuthenticated) return;

    const userRefreshInterval = setInterval(() => {
      // Refresh user data less frequently to avoid rate limiting
      refreshUserData().catch(() => {
        // Silently ignore errors
      });
    }, 180000); // Refresh user data every 3 minutes

    return () => clearInterval(userRefreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    // Fetch fresh user data to ensure is_superuser is loaded
    const user = await authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    // Don't include user refresh here to avoid duplicate calls
    refreshData(true, true, false);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setShowLogin(false); // Reset to show landing page instead of login
    setCurrentPage('home'); // Reset to home page
    setClients([]);
    setTickets([]);
    setAssets([]);
    setCurrentUser(null);
    // Scroll to top when logging out
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Client Handlers ---
  const handleAddClient = async (clientData: Omit<Client, 'id' | 'joinDate'>) => {
    try {
      await api.addClient(clientData);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add client';
      setError(errorMessage);
      console.error('Error adding client:', err);
      throw err;
    }
  };

  const handleUpdateClient = async (clientData: Client) => {
    try {
      await api.updateClient(clientData);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update client';
      setError(errorMessage);
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await api.deleteClient(clientId);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete client';
      setError(errorMessage);
      console.error('Error deleting client:', err);
      throw err;
    }
  };

  // --- Ticket Handlers ---
  const handleAddTicket = async (ticketData: Omit<Ticket, 'id' | 'createdDate'>) => {
    try {
      await api.addTicket(ticketData);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add ticket';
      setError(errorMessage);
      console.error('Error adding ticket:', err);
      throw err;
    }
  };

  const handleUpdateTicket = async (ticketData: Ticket) => {
    try {
      await api.updateTicket(ticketData);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update ticket';
      setError(errorMessage);
      console.error('Error updating ticket:', err);
      throw err;
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await api.deleteTicket(ticketId);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete ticket';
      setError(errorMessage);
      console.error('Error deleting ticket:', err);
      throw err;
    }
  };

  // --- Asset Handlers ---
  const handleAddAsset = async (assetData: Omit<Asset, 'id'>) => {
    try {
      await api.addAsset(assetData);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add asset';
      setError(errorMessage);
      console.error('Error adding asset:', err);
      throw err;
    }
  };

  const handleUpdateAsset = async (assetData: Asset) => {
    try {
      await api.updateAsset(assetData);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update asset';
      setError(errorMessage);
      console.error('Error updating asset:', err);
      throw err;
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      await api.deleteAsset(assetId);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete asset';
      setError(errorMessage);
      console.error('Error deleting asset:', err);
      throw err;
    }
  };


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            clients={clients} 
            tickets={tickets} 
            assets={assets}
            onAddTicket={handleAddTicket}
            onUpdateTicket={handleUpdateTicket}
            onDeleteTicket={handleDeleteTicket}
            currentUser={user}
          />
        );
      case 'clients':
        return (
          <ClientManager 
            clients={clients} 
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
          />
        );
      case 'tickets':
        return (
            <TicketManager 
                tickets={tickets} 
                clients={clients}
                onAddTicket={handleAddTicket}
                onUpdateTicket={handleUpdateTicket}
                onDeleteTicket={handleDeleteTicket}
            />
        );
      case 'assets':
        return (
            <AssetManager 
                assets={assets} 
                clients={clients} 
                onAddAsset={handleAddAsset}
                onUpdateAsset={handleUpdateAsset}
                onDeleteAsset={handleDeleteAsset}
            />
        );
      case 'ai-assistant':
        return <AiAssistant />;
      case 'users':
        return <UserManager currentUser={user} />;
      default:
        return <Dashboard clients={clients} tickets={tickets} assets={assets} />;
    }
  };

  // Show loading state only on initial load (and not if we're checking auth)
  if (checkingAuth) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    if (showLogin) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    
    // Show different pages based on currentPage state
    if (currentPage === 'services') {
      return (
        <ServicesPage
          onLoginClick={() => setShowLogin(true)}
          onContactClick={() => setCurrentPage('contact')}
        />
      );
    }
    
    if (currentPage === 'contact') {
      return (
        <ContactPage
          onLoginClick={() => setShowLogin(true)}
          onServicesClick={() => setCurrentPage('services')}
        />
      );
    }
    
    return (
      <HomePage
        onLoginClick={() => setShowLogin(true)}
        onServicesClick={() => setCurrentPage('services')}
        onContactClick={() => setCurrentPage('contact')}
      />
    );
  }

  // Show loading state only on initial load
  if (loading && clients.length === 0 && tickets.length === 0 && assets.length === 0 && !error) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading application data...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Connecting to API at {import.meta.env.VITE_API_URL || 'http://localhost:8000'}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">If this takes too long, check the browser console (F12)</p>
          <button 
            onClick={() => { setLoading(false); setError('Loading timeout - please refresh'); }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel Loading
          </button>
        </div>
      </div>
    );
  }

  // Use state for current user (refreshed automatically) or fallback to cached
  const user = currentUser || authService.getUser();
  const isAdmin = !!(user?.is_superuser);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout}
        isAdmin={isAdmin}
      />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <div className="mt-3 space-x-2">
              <button
                onClick={() => {
                  setError(null);
                  refreshData();
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Retry
              </button>
              <button
                onClick={() => setError(null)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;