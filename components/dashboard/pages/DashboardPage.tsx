import React from 'react';
import StatCard from '../StatCard';
import { ClientsIcon, TicketsIcon, AssetsIcon } from '../../icons';
import type { Client, Ticket, Asset } from '../../../types';

interface DashboardPageProps {
    clients: Client[];
    tickets: Ticket[];
    assets: Asset[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ clients, tickets, assets }) => {
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const recentTickets = [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    const newClients = [...clients].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-status-red text-white';
            case 'In Progress': return 'bg-yellow-500 text-black';
            case 'Closed': return 'bg-status-green text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getClientName = (clientId: string) => {
        return clients.find(c => c.id === clientId)?.companyName || 'Unknown';
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={ClientsIcon} title="Total Clients" value={clients.length} />
                <StatCard icon={TicketsIcon} title="Open Tickets" value={openTickets} />
                <StatCard icon={AssetsIcon} title="Managed Assets" value={assets.length} />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Tickets */}
                <div className="bg-neutral-dark p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-white">Recent Tickets</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                             <thead className="text-xs uppercase bg-neutral text-gray-300">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Subject</th>
                                    <th scope="col" className="px-4 py-3">Client</th>
                                    <th scope="col" className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTickets.map(ticket => (
                                    <tr key={ticket.id} className="border-b border-neutral">
                                        <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{ticket.subject}</td>
                                        <td className="px-4 py-3">{getClientName(ticket.clientId)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* New Clients */}
                <div className="bg-neutral-dark p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4 text-white">New Clients</h2>
                    <div className="space-y-4">
                        {newClients.map(client => (
                             <div key={client.id} className="flex items-center justify-between p-3 bg-neutral rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-white">
                                        {client.contactPerson.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{client.companyName}</p>
                                        <p className="text-xs text-gray-400">{client.email}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400">{new Date(client.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
