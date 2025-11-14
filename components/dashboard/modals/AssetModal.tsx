import React, { useState } from 'react';
import { Asset, Client } from '../../../types';
import ModalWrapper from './ModalWrapper';

interface AssetModalProps {
    asset?: Asset;
    clients: Client[];
    onClose: () => void;
    onSubmit: (asset: Omit<Asset, 'id'> | Asset) => void;
}

const AssetModal: React.FC<AssetModalProps> = ({ asset, clients, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        assetName: asset?.assetName || '',
        type: asset?.type || '',
        clientId: asset?.clientId || (clients[0]?.id || ''),
        purchaseDate: asset?.purchaseDate || '',
        warrantyEnd: asset?.warrantyEnd || '',
        macAddress: asset?.macAddress || '',
        serialNumber: asset?.serialNumber || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (asset) {
            onSubmit({ ...asset, ...formData });
        } else {
            onSubmit(formData);
        }
    };

    return (
        <ModalWrapper title={asset ? 'Edit Asset' : 'Add New Asset'} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="assetName" className="block text-sm font-medium text-gray-300">Asset Name</label>
                            <input type="text" name="assetName" id="assetName" value={formData.assetName} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
                            <input type="text" name="type" id="type" value={formData.type} onChange={handleChange} required placeholder="e.g., Server, Laptop, Switch" className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="clientId" className="block text-sm font-medium text-gray-300">Client</label>
                        <select name="clientId" id="clientId" value={formData.clientId} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2">
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.companyName}</option>
                            ))}
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-300">Serial Number</label>
                            <input type="text" name="serialNumber" id="serialNumber" value={formData.serialNumber} onChange={handleChange} className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="macAddress" className="block text-sm font-medium text-gray-300">MAC Address</label>
                            <input type="text" name="macAddress" id="macAddress" value={formData.macAddress} onChange={handleChange} className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-300">Purchase Date</label>
                            <input type="date" name="purchaseDate" id="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="warrantyEnd" className="block text-sm font-medium text-gray-300">Warranty End Date</label>
                            <input type="date" name="warrantyEnd" id="warrantyEnd" value={formData.warrantyEnd} onChange={handleChange} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral text-white font-semibold rounded-md hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition">Save Asset</button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default AssetModal;