import React, { useState } from 'react';
import ModalWrapper from '../modals/ModalWrapper';
import type { Asset, Ticket } from '../../../types';

interface CustomerTicketModalProps {
    assets: Asset[];
    onClose: () => void;
    onSubmit: (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'clientId' | 'contact' | 'status'>) => void;
}

const CustomerTicketModal: React.FC<CustomerTicketModalProps> = ({ assets, onClose, onSubmit }) => {
    const [subject, setSubject] = useState('');
    const [assetId, setAssetId] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            subject,
            assetId: assetId || undefined,
            description,
        });
    };

    return (
        <ModalWrapper title="Open a New Support Ticket" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Subject</label>
                    <input 
                        type="text" 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        required 
                        className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2" 
                        placeholder="e.g., Cannot connect to the internet"
                    />
                </div>
                <div>
                    <label htmlFor="assetId" className="block text-sm font-medium text-gray-300">Related Asset (Optional)</label>
                    <select 
                        id="assetId" 
                        value={assetId} 
                        onChange={(e) => setAssetId(e.target.value)} 
                        className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2 disabled:bg-gray-700" 
                        disabled={assets.length === 0}
                    >
                        <option value="">{assets.length > 0 ? 'Select an asset' : 'No assets found'}</option>
                        {assets.map(asset => (
                            <option key={asset.id} value={asset.id}>{asset.assetName} (S/N: {asset.serialNumber})</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        rows={5} 
                        className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2"
                        placeholder="Please provide as much detail as possible about the issue you are experiencing."
                    ></textarea>
                </div>
                 <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral text-white font-semibold rounded-md hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition">Submit Ticket</button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default CustomerTicketModal;