import React, { useState, useMemo, useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { PieChart, BarChart } from './customer/charts';
import CustomerTicketModal from './customer/CustomerTicketModal';
import ContactModal from './customer/ContactModal';
import WhatsAppChatbox from './customer/WhatsAppChatbox';
import { WhatsAppIcon, SupportIcon, EmailIcon, CloseIcon } from '../icons';
import { authService } from '../../services/auth';
import type { Ticket, Asset, Client, ChartDataItem } from '../../types';

interface CustomerDashboardProps {
    onLogout: () => void;
    clients: Client[];
    tickets: Ticket[];
    assets: Asset[];
    onAddTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
    teamWhatsAppNumber: string;
    contactFormEmailTarget: string;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout, clients, tickets, assets, onAddTicket, teamWhatsAppNumber, contactFormEmailTarget }) => {
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isChatboxOpen, setIsChatboxOpen] = useState(false);
    const [isContactFlyoutOpen, setIsContactFlyoutOpen] = useState(false);
    const [customerClient, setCustomerClient] = useState<Client | undefined>(undefined);
    
    // Find customer client by matching logged-in user's email
    useEffect(() => {
        const findCustomerClient = async () => {
            const user = await authService.getCurrentUser();
            if (user && user.email) {
                // Find client by matching email
                const client = clients.find(c => c.email.toLowerCase() === user.email.toLowerCase());
                if (client) {
                    setCustomerClient(client);
                } else {
                    // Fallback: try to find by first client if user email doesn't match
                    // This is a temporary solution until client-user linking is implemented
                    console.warn('Could not find client for user email:', user.email);
                    if (clients.length > 0) {
                        setCustomerClient(clients[0]);
                    }
                }
            } else if (clients.length > 0) {
                // Fallback if no user info
                setCustomerClient(clients[0]);
            }
        };
        findCustomerClient();
    }, [clients]);
    
    const customerTickets = customerClient ? tickets.filter(ticket => ticket.clientId === customerClient.id) : [];
    const customerAssets = customerClient ? assets.filter(asset => asset.clientId === customerClient.id) : [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-status-red text-white';
            case 'In Progress': return 'bg-yellow-500 text-black';
            case 'Closed': return 'bg-status-green text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const ticketStatusData: ChartDataItem[] = useMemo(() => {
        const counts = customerTickets.reduce((acc, ticket) => {
            acc[ticket.status] = (acc[ticket.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { label: 'Open', value: counts['Open'] || 0, color: '#ef4444' },
            { label: 'In Progress', value: counts['In Progress'] || 0, color: '#f59e0b' },
            { label: 'Closed', value: counts['Closed'] || 0, color: '#22c55e' },
        ];
    }, [customerTickets]);

     const assetTypeData: ChartDataItem[] = useMemo(() => {
        const counts = customerAssets.reduce((acc, asset) => {
            acc[asset.type] = (acc[asset.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f97316'];
        return Object.entries(counts).map(([label, value], index) => ({
            label,
            value,
            color: colors[index % colors.length],
        }));
    }, [customerAssets]);

    const handleOpenTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'clientId' | 'contact' | 'status'>) => {
        if (!customerClient) return;
        const newTicket: Omit<Ticket, 'id' | 'createdAt'> = {
            ...ticketData,
            clientId: customerClient.id,
            contact: {
                name: customerClient.contactPerson,
                email: customerClient.email,
                phone: customerClient.phone
            },
            status: 'Open'
        };
        onAddTicket(newTicket);
        setIsTicketModalOpen(false);
    }

    const handleContactSubmit = (message: string) => {
        if (!customerClient) {
            alert("Could not identify the current user. Please try again.");
            return;
        }

        // Simulate a successful form submission since there's no backend.
        console.log('--- Contact Form Submission ---');
        console.log(`From: ${customerClient.companyName} (${customerClient.email})`);
        console.log(`Message: ${message}`);
        console.log('-----------------------------');
        
        alert("Thank you for your message. We've received it and will get back to you shortly.");
        setIsContactModalOpen(false);
    }

    const toggleContactFlyout = () => {
        setIsContactFlyoutOpen(prev => !prev);
        if (isChatboxOpen) {
            setIsChatboxOpen(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-neutral-light dark:bg-neutral-darker relative">
            <Header 
                isAuthenticated={true} 
                onLogoutClick={onLogout} 
                onLoginClick={() => {}} 
                onContactClick={() => setIsContactModalOpen(true)}
            />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">
                        Welcome, {customerClient?.companyName || 'Customer'}!
                    </h1>
                    <button
                        onClick={() => setIsTicketModalOpen(true)}
                        className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition-transform transform hover:scale-105 shadow-lg"
                    >
                        Open New Ticket
                    </button>
                </div>
                
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Ticket Overview</h2>
                        <PieChart data={ticketStatusData} />
                    </div>
                    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">Asset Types</h2>
                        <BarChart data={assetTypeData} />
                    </div>
                </div>

                {/* Data Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* My Tickets Section */}
                    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">My Tickets</h2>
                        <div className="overflow-x-auto">
                             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-neutral dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Subject</th>
                                        <th scope="col" className="px-6 py-3">Asset</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerTickets.map(ticket => (
                                        <tr key={ticket.id} className="bg-white dark:bg-neutral-dark border-b dark:border-neutral">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{ticket.subject}</td>
                                            <td className="px-6 py-4">{assets.find(a => a.id === ticket.assetId)?.assetName || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{ticket.createdAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* My Assets Section */}
                    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">My Assets</h2>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-neutral dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Asset Name</th>
                                        <th scope="col" className="px-6 py-3">Serial #</th>
                                        <th scope="col" className="px-6 py-3">Warranty End</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerAssets.map(asset => (
                                        <tr key={asset.id} className="bg-white dark:bg-neutral-dark border-b dark:border-neutral">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{asset.assetName}</td>
                                            <td className="px-6 py-4">{asset.serialNumber}</td>
                                            <td className="px-6 py-4">{asset.warrantyEnd}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            
            {isChatboxOpen && (
                <WhatsAppChatbox 
                    phoneNumber={teamWhatsAppNumber}
                    onClose={() => setIsChatboxOpen(false)}
                />
            )}

             {isContactFlyoutOpen && (
                <div className="fixed bottom-24 right-6 flex flex-col items-end space-y-3 z-40">
                    <a 
                       href={`mailto:${contactFormEmailTarget}`}
                       className="flex items-center px-4 py-2 bg-secondary text-white rounded-lg shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-105"
                    >
                       <EmailIcon className="w-5 h-5 mr-2" /> Send an Email
                    </a>
                    <button
                        onClick={() => {
                            setIsChatboxOpen(true);
                            setIsContactFlyoutOpen(false);
                        }}
                        className="flex items-center px-4 py-2 bg-[#25D366] text-white rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                    >
                       <WhatsAppIcon className="w-5 h-5 mr-2" /> Chat on WhatsApp
                    </button>
                </div>
             )}

             <button
                onClick={toggleContactFlyout}
                className="fixed bottom-6 right-6 bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform z-40"
                aria-label="Contact Support"
            >
                {isContactFlyoutOpen ? <CloseIcon className="w-8 h-8"/> : <SupportIcon className="w-8 h-8" />}
            </button>
            
            {isTicketModalOpen && (
                <CustomerTicketModal 
                    assets={customerAssets}
                    onClose={() => setIsTicketModalOpen(false)}
                    onSubmit={handleOpenTicket}
                />
            )}
            {isContactModalOpen && (
                <ContactModal 
                    onClose={() => setIsContactModalOpen(false)}
                    onSubmit={handleContactSubmit}
                />
            )}
            <Footer />
        </div>
    );
};

export default CustomerDashboard;