import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import TicketsPage from './pages/TicketsPage';
import AssetsPage from './pages/AssetsPage';
import AiAssistantPage from './pages/AiAssistantPage';
import type { Client, Ticket, Asset } from '../../types';

type View = 'dashboard' | 'clients' | 'tickets' | 'assets' | 'ai-assistant';

interface DashboardLayoutProps {
    onLogout: () => void;
    clients: Client[];
    tickets: Ticket[];
    assets: Asset[];
    guidesByAssetModel: Record<string, { name: string, content: string }>;
    isUploadingGuideForModel: string | null;
    onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
    onAddTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
    onUpdateTicket: (ticket: Ticket) => void;
    onDeleteTicket: (ticketId: string) => void;
    onAddAsset: (asset: Omit<Asset, 'id'>) => void;
    onUpdateAsset: (asset: Asset) => void;
    onDeleteAsset: (assetId: string) => void;
    onGuideUpload: (assetName: string, file: File) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
    const {
        onLogout,
        clients, tickets, assets, guidesByAssetModel, isUploadingGuideForModel,
        onAddClient, onUpdateClient, onDeleteClient,
        onAddTicket, onUpdateTicket, onDeleteTicket,
        onAddAsset, onUpdateAsset, onDeleteAsset,
        onGuideUpload
    } = props;

    const [activeView, setActiveView] = useState<View>('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardPage clients={clients} tickets={tickets} assets={assets} />;
            case 'clients':
                return <ClientsPage clients={clients} onAddClient={onAddClient} onUpdateClient={onUpdateClient} onDeleteClient={onDeleteClient} />;
            case 'tickets':
                return <TicketsPage tickets={tickets} clients={clients} assets={assets} onAddTicket={onAddTicket} onUpdateTicket={onUpdateTicket} onDeleteTicket={onDeleteTicket} />;
            case 'assets':
                return <AssetsPage assets={assets} clients={clients} onAddAsset={onAddAsset} onUpdateAsset={onUpdateAsset} onDeleteAsset={onDeleteAsset} />;
            case 'ai-assistant':
                return <AiAssistantPage assets={assets} clients={clients} onGuideUpload={onGuideUpload} guidesByAssetModel={guidesByAssetModel} isUploadingGuideForModel={isUploadingGuideForModel} />;
            default:
                return <DashboardPage clients={clients} tickets={tickets} assets={assets} />;
        }
    };

    return (
        <div className="flex h-screen bg-neutral-darker text-gray-200 font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={onLogout} />
            <main className="flex-1 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardLayout;