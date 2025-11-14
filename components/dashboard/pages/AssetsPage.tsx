import React, { useState } from 'react';
import { Asset, Client } from '../../../types';
import { EditIcon, TrashIcon } from '../../icons';
import AssetModal from '../modals/AssetModal';
import ConfirmationModal from '../modals/ConfirmationModal';

interface AssetsPageProps {
    assets: Asset[];
    clients: Client[];
    onAddAsset: (asset: Omit<Asset, 'id'>) => void;
    onUpdateAsset: (asset: Asset) => void;
    onDeleteAsset: (assetId: string) => void;
}

const AssetsPage: React.FC<AssetsPageProps> = ({ assets, clients, onAddAsset, onUpdateAsset, onDeleteAsset }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | undefined>(undefined);
    const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);

    const handleAddClick = () => {
        setEditingAsset(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (asset: Asset) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (assetId: string) => {
        setDeletingAssetId(assetId);
        setIsConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (deletingAssetId) {
            onDeleteAsset(deletingAssetId);
        }
        setIsConfirmOpen(false);
        setDeletingAssetId(null);
    };
    
    const handleFormSubmit = (assetData: Omit<Asset, 'id'> | Asset) => {
        if ('id' in assetData) {
            onUpdateAsset(assetData);
        } else {
            onAddAsset(assetData);
        }
        setIsModalOpen(false);
    };
    
    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.companyName || 'Unknown';
    
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Asset Management</h1>
                <button
                    onClick={handleAddClick}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
                >
                    Add New Asset
                </button>
            </div>
            
            <div className="bg-neutral-dark shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-neutral text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Asset Name</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Client</th>
                                <th scope="col" className="px-6 py-3">Serial #</th>
                                <th scope="col" className="px-6 py-3">MAC Address</th>
                                <th scope="col" className="px-6 py-3">Warranty End</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map(asset => (
                                <tr key={asset.id} className="border-b border-neutral hover:bg-neutral">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{asset.assetName}</td>
                                    <td className="px-6 py-4">{asset.type}</td>
                                    <td className="px-6 py-4">{getClientName(asset.clientId)}</td>
                                    <td className="px-6 py-4">{asset.serialNumber}</td>
                                    <td className="px-6 py-4">{asset.macAddress}</td>
                                    <td className="px-6 py-4">{asset.warrantyEnd}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleEditClick(asset)} className="mr-4 text-blue-400 hover:text-blue-300"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteClick(asset.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <AssetModal
                    asset={editingAsset}
                    clients={clients}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
            {isConfirmOpen && (
                <ConfirmationModal
                    title="Delete Asset"
                    message="Are you sure you want to delete this asset? This action cannot be undone."
                    onConfirm={confirmDelete}
                    onCancel={() => setIsConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default AssetsPage;