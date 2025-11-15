import React, { useState, useEffect, useMemo } from 'react';
import { Ticket, Client, Asset, TicketStatus } from '../../../types';
import ModalWrapper from './ModalWrapper';
import { FileIcon, CloseIcon } from '../../icons';

interface TicketModalProps {
    ticket?: Ticket;
    clients: Client[];
    assets: Asset[];
    onClose: () => void;
    onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt'> | Ticket) => void;
}

const TICKET_STATUSES: TicketStatus[] = ['Open', 'In Progress', 'Closed'];

const TicketModal: React.FC<TicketModalProps> = ({ ticket, clients, assets, onClose, onSubmit }) => {
    
    const [clientId, setClientId] = useState(ticket?.clientId || (clients[0]?.id || ''));
    const [contactName, setContactName] = useState(ticket?.contact.name || '');
    const [contactEmail, setContactEmail] = useState(ticket?.contact.email || '');
    const [contactPhone, setContactPhone] = useState(ticket?.contact.phone || '');
    const [contactMobile, setContactMobile] = useState(ticket?.contact.mobile || '');
    const [subject, setSubject] = useState(ticket?.subject || '');
    const [assetId, setAssetId] = useState(ticket?.assetId || '');
    const [status, setStatus] = useState<TicketStatus>(ticket?.status || 'Open');
    const [description, setDescription] = useState(ticket?.description || '');
    const [notes, setNotes] = useState(ticket?.notes || '');
    const [newAttachments, setNewAttachments] = useState<File[]>([]);

    const clientAssets = useMemo(() => assets.filter(a => a.clientId === clientId), [assets, clientId]);

    useEffect(() => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            // Pre-fill contact from client if creating a new ticket
            if (!ticket) {
                setContactName(client.contactPerson);
                setContactEmail(client.email);
                setContactPhone(client.phone);
            }
        }
        // Reset asset if client changes and selected asset doesn't belong to them
        if (!clientAssets.some(a => a.id === assetId)) {
            setAssetId('');
        }
    }, [clientId, clients, ticket, clientAssets, assetId]);

    const handleRemoveNewAttachment = (indexToRemove: number) => {
        setNewAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine existing attachments with new ones
        const combinedAttachments = [
            ...(ticket?.attachments || []),
            ...newAttachments.map(f => ({ name: f.name })) // In a real app, you'd upload this and get URLs/IDs
        ];
        
        const ticketData = {
            subject,
            clientId,
            contact: {
                name: contactName,
                email: contactEmail,
                phone: contactPhone,
                mobile: contactMobile
            },
            assetId: assetId || undefined,
            status,
            description,
            notes,
            attachments: combinedAttachments
        };
        
        if (ticket) {
            onSubmit({ ...ticket, ...ticketData });
        } else {
            onSubmit(ticketData);
        }
    };

    return (
        <ModalWrapper title={ticket ? 'Edit Ticket' : 'Create Ticket'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                
                <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-300">Client</label>
                    <select 
                        id="clientId" 
                        value={clientId} 
                        onChange={(e) => setClientId(e.target.value)} 
                        required 
                        className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"
                    >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.companyName || client.name || client.email}
                            </option>
                        ))}
                    </select>
                </div>

                <fieldset className="border border-gray-600 p-4 rounded-md">
                    <legend className="text-sm font-medium text-gray-300 px-2">Contact Information</legend>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} required className="block w-full bg-neutral text-white border-gray-600 rounded-md p-2" />
                        <input type="email" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required className="block w-full bg-neutral text-white border-gray-600 rounded-md p-2" />
                        <input type="tel" placeholder="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required className="block w-full bg-neutral text-white border-gray-600 rounded-md p-2" />
                        <input type="tel" placeholder="Mobile Phone" value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} className="block w-full bg-neutral text-white border-gray-600 rounded-md p-2" />
                    </div>
                </fieldset>

                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300">Subject</label>
                    <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="assetId" className="block text-sm font-medium text-gray-300">Linked Asset (Optional)</label>
                        <select id="assetId" value={assetId} onChange={(e) => setAssetId(e.target.value)} className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2 disabled:bg-gray-700" disabled={clientAssets.length === 0}>
                            <option value="">{clientAssets.length > 0 ? 'None' : 'No assets for this client'}</option>
                            {clientAssets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.assetName}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as TicketStatus)} required className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2">
                            {TICKET_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2"></textarea>
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Internal Notes</label>
                    <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2"></textarea>
                </div>

                <div>
                    <label htmlFor="attachments" className="block text-sm font-medium text-gray-300">Add Attachments</label>
                    <input type="file" id="attachments" multiple onChange={(e) => setNewAttachments(Array.from(e.target.files || []))} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"/>
                </div>
                
                {/* Existing attachments */}
                {ticket?.attachments && ticket.attachments.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-300">Existing Attachments</p>
                        <ul className="mt-2 space-y-2">
                            {ticket.attachments.map((file, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-400 bg-neutral p-2 rounded-md">
                                    <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* New attachments preview */}
                {newAttachments.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-300">New Attachments</p>
                        <ul className="mt-2 space-y-2">
                            {newAttachments.map((file, index) => (
                                <li key={index} className="flex items-center justify-between text-sm text-gray-300 bg-neutral p-2 rounded-md">
                                    <div className="flex items-center truncate">
                                        <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveNewAttachment(index)}
                                        className="ml-2 text-gray-400 hover:text-white"
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <CloseIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}


                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral text-white font-semibold rounded-md hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition">Save Ticket</button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default TicketModal;