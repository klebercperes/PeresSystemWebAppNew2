import React, { useState } from 'react';
import { Ticket, Client, Asset } from '../../../types';
import { EditIcon, TrashIcon } from '../../icons';
import TicketModal from '../modals/TicketModal';
import ConfirmationModal from '../modals/ConfirmationModal';

interface TicketsPageProps {
    tickets: Ticket[];
    clients: Client[];
    assets: Asset[];
    onAddTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
    onUpdateTicket: (ticket: Ticket) => void;
    onDeleteTicket: (ticketId: string) => void;
}

const TicketsPage: React.FC<TicketsPageProps> = ({ tickets, clients, assets, onAddTicket, onUpdateTicket, onDeleteTicket }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | undefined>(undefined);
    const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditingTicket(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (ticket: Ticket) => {
        setEditingTicket(ticket);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (ticketId: string) => {
        setDeletingTicketId(ticketId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deletingTicketId) {
            onDeleteTicket(deletingTicketId);
        }
        setIsConfirmOpen(false);
        setDeletingTicketId(null);
    };

    const handleFormSubmit = (ticketData: Omit<Ticket, 'id' | 'createdAt'> | Ticket) => {
        if ('id' in ticketData) {
            onUpdateTicket(ticketData);
        } else {
            onAddTicket(ticketData);
        }
        setIsModalOpen(false);
    };
    
    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.companyName || 'Unknown';
    const getAssetName = (assetId?: string) => assets.find(a => a.id === assetId)?.assetName || 'N/A';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-status-red text-white';
            case 'In Progress': return 'bg-yellow-500 text-black';
            case 'Closed': return 'bg-status-green text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Ticket Management</h1>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
                >
                    Create Ticket
                </button>
            </div>
            
            <div className="bg-neutral-dark shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-neutral text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Subject</th>
                                <th scope="col" className="px-6 py-3">Client</th>
                                <th scope="col" className="px-6 py-3">Asset</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Created</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="border-b border-neutral hover:bg-neutral">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{ticket.subject}</td>
                                    <td className="px-6 py-4">{getClientName(ticket.clientId)}</td>
                                    <td className="px-6 py-4">{getAssetName(ticket.assetId)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{ticket.createdAt}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEditClick(ticket)} className="mr-4 text-blue-400 hover:text-blue-300"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteClick(ticket.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <TicketModal
                    ticket={editingTicket}
                    clients={clients}
                    assets={assets}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
            {isConfirmOpen && (
                <ConfirmationModal
                    title="Delete Ticket"
                    message="Are you sure you want to delete this ticket? This action cannot be undone."
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default TicketsPage;
