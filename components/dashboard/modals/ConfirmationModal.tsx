import React from 'react';
import ModalWrapper from './ModalWrapper';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => {
    return (
        <ModalWrapper title={title} onClose={onCancel}>
            <div>
                <p className="text-gray-300">{message}</p>
                <div className="mt-8 flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-neutral text-white font-semibold rounded-md hover:bg-gray-600 transition">Cancel</button>
                    <button type="button" onClick={onConfirm} className="px-4 py-2 bg-status-red text-white font-semibold rounded-md hover:bg-red-600 transition">Confirm Delete</button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ConfirmationModal;
