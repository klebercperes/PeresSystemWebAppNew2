import React, { useState } from 'react';
import { SendIcon, CloseIcon } from '../../icons';

interface WhatsAppChatboxProps {
    phoneNumber: string;
    onClose: () => void;
}

const WhatsAppChatbox: React.FC<WhatsAppChatboxProps> = ({ phoneNumber, onClose }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;

        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <div className="fixed bottom-24 right-6 w-80 max-w-[calc(100vw-3rem)] bg-white dark:bg-neutral-dark rounded-lg shadow-2xl z-50 flex flex-col animate-fade-in-up">
            <header className="flex items-center justify-between p-3 bg-primary text-white rounded-t-lg">
                <h3 className="font-bold">Chat with Support</h3>
                <button onClick={onClose} aria-label="Close chatbox">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </header>
            <main className="p-4 flex-grow">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full h-32 p-2 border border-gray-300 dark:border-neutral rounded-md resize-none bg-neutral-light dark:bg-neutral text-neutral-dark dark:text-white focus:ring-primary focus:border-primary"
                    autoFocus
                />
            </main>
            <footer className="p-3 border-t border-gray-200 dark:border-neutral-darker">
                <button 
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition disabled:bg-neutral disabled:cursor-not-allowed"
                >
                    <SendIcon className="w-5 h-5 mr-2" />
                    Send on WhatsApp
                </button>
            </footer>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default WhatsAppChatbox;