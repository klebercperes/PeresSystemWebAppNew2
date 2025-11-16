import React, { useState } from 'react';
import { Client } from '../../../types';
import ModalWrapper from './ModalWrapper';

interface ClientModalProps {
    client?: Client;
    onClose: () => void;
    onSubmit: (client: Omit<Client, 'id' | 'createdAt'> | Client) => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ client, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        companyName: client?.companyName || '',
        contactPerson: client?.contactPerson || '',
        email: client?.email || '',
        phone: client?.phone || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (client) {
            onSubmit({ ...client, ...formData });
        } else {
            onSubmit(formData);
        }
    };

    return (
        <ModalWrapper title={client ? 'Edit Client' : 'Add New Client'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-300">Client</label>
                        <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300">Contact Person</label>
                        <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral text-white font-semibold rounded-md hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition">Save Client</button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default ClientModal;
