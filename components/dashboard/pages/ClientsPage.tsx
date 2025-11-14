import React, { useState } from 'react';
import { Client } from '../../../types';
import { EditIcon, TrashIcon } from '../../icons';
import ClientModal from '../modals/ClientModal';
import ConfirmationModal from '../modals/ConfirmationModal';

interface ClientsPageProps {
    clients: Client[];
    onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
    onUpdateClient: (client: Client) => void;
    onDeleteClient: (clientId: string) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients, onAddClient, onUpdateClient, onDeleteClient }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | undefined>(undefined);
    const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditingClient(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (clientId: string) => {
        setDeletingClientId(clientId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deletingClientId) {
            onDeleteClient(deletingClientId);
        }
        setIsConfirmOpen(false);
        setDeletingClientId(null);
    };

    const handleFormSubmit = (clientData: Omit<Client, 'id' | 'createdAt'> | Client) => {
        if ('id' in clientData) {
            onUpdateClient(clientData);
        } else {
            onAddClient(clientData);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Client Management</h1>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
                >
                    Add New Client
                </button>
            </div>
            
            <div className="bg-neutral-dark shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-neutral text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Company Name</th>
                                <th scope="col" className="px-6 py-3">Contact Person</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Phone</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} className="border-b border-neutral hover:bg-neutral">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{client.companyName}</td>
                                    <td className="px-6 py-4">{client.contactPerson}</td>
                                    <td className="px-6 py-4">{client.email}</td>
                                    <td className="px-6 py-4">{client.phone}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEditClick(client)} className="mr-4 text-blue-400 hover:text-blue-300"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteClick(client.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {isModalOpen && (
                <ClientModal
                    client={editingClient}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
            {isConfirmOpen && (
                <ConfirmationModal
                    title="Delete Client"
                    message="Are you sure you want to delete this client? This will also delete all associated tickets and assets. This action cannot be undone."
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default ClientsPage;
