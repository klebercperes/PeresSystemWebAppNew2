import React, { useState } from 'react';
import ModalWrapper from '../modals/ModalWrapper';

interface ContactModalProps {
    onClose: () => void;
    onSubmit: (message: string) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onSubmit }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSubmit(message);
        }
    };

    return (
        <ModalWrapper title="Contact Us" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">Your Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={6}
                        className="mt-1 block w-full bg-neutral text-white border-gray-600 rounded-md p-2"
                        placeholder="How can we help you today?"
                    ></textarea>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral text-white font-semibold rounded-md hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition">Send Message</button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default ContactModal;