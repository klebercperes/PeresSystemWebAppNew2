import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Asset, Client } from '../../../types';
import { AiAssistantIcon, UploadIcon, SendIcon } from '../../icons';

interface AiAssistantPageProps {
    assets: Asset[];
    clients: Client[];
    onGuideUpload: (assetName: string, file: File) => void;
    guidesByAssetModel: Record<string, { name: string, content: string }>;
    isUploadingGuideForModel: string | null;
}

type Message = {
    sender: 'user' | 'ai';
    text: string;
}

const AiAssistantPage: React.FC<AiAssistantPageProps> = ({ assets, clients, onGuideUpload, guidesByAssetModel, isUploadingGuideForModel }) => {
    const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = async () => {
        if (!userInput.trim() || !selectedAssetId) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const selectedAsset = assets.find(a => a.id === selectedAssetId);
            if (!selectedAsset) {
                throw new Error("Selected asset not found.");
            }
            const guide = guidesByAssetModel[selectedAsset.assetName];
            
            let prompt = `You are an expert IT support assistant for Peres Systems. A user has a question about the asset: "${selectedAsset.assetName}" (Type: ${selectedAsset.type}).\n\n`;

            if (guide) {
                prompt += `They have provided a technical guide named "${guide.name}". Use the following content from the guide as the primary context to answer the question:\n\n---\n${guide.content.substring(0, 4000)}\n---\n\n`;
            }
            
            prompt += `Please provide a helpful and professional response to the user's question: "${userInput}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = { sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const asset = assets.find(a => a.id === selectedAssetId);
        if (file && asset) {
            onGuideUpload(asset.assetName, file);
        }
    };
    
    const getClientName = (clientId: string) => clients.find(c => c.id === clientId)?.companyName || 'Unknown Client';
    const selectedAsset = assets.find(a => a.id === selectedAssetId);

    return (
        <div className="flex h-full flex-col">
            <div className="p-8 border-b border-neutral">
                <h1 className="text-3xl font-bold text-white flex items-center"><AiAssistantIcon className="w-8 h-8 mr-3 text-primary"/> AI Assistant</h1>
                <p className="mt-2 text-gray-400">Select an asset and upload a guide for its model to get contextual support.</p>
            </div>
            
            <div className="flex-grow flex overflow-hidden">
                {/* Left Panel - Context Selection */}
                <div className="w-1/3 border-r border-neutral p-6 flex flex-col space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="asset-select" className="block text-sm font-medium text-gray-300 mb-1">Select Asset</label>
                        <select
                            id="asset-select"
                            value={selectedAssetId}
                            onChange={(e) => setSelectedAssetId(e.target.value)}
                            className="w-full bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2"
                        >
                            <option value="" disabled>-- Choose an asset --</option>
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.assetName} ({getClientName(asset.clientId)})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.txt,.md" className="hidden"/>
                        <button onClick={() => fileInputRef.current?.click()} disabled={!selectedAssetId || !!isUploadingGuideForModel} className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition disabled:bg-neutral disabled:cursor-not-allowed">
                             {isUploadingGuideForModel === selectedAsset?.assetName ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <UploadIcon className="w-5 h-5 mr-2"/>
                                    Upload Guide
                                </>
                            )}
                        </button>
                        <p className="mt-2 text-xs text-gray-500">For best results, upload a .txt or .md file. PDF text extraction is for demonstration purposes.</p>
                    </div>
                    {selectedAsset && (
                        <div className="bg-neutral p-4 rounded-md text-sm text-gray-300">
                           <p className="font-bold">Context for model: {selectedAsset.assetName}</p>
                           {isUploadingGuideForModel === selectedAsset.assetName ? (
                               <p className="mt-2 text-blue-400">Processing guide...</p>
                           ) : guidesByAssetModel[selectedAsset.assetName] ? (
                               <p className="mt-2 text-green-400">✓ Guide loaded: <span className="font-mono">{guidesByAssetModel[selectedAsset.assetName].name}</span></p>
                           ) : (
                               <p className="mt-2 text-yellow-400">! No guide uploaded for this model. Responses will be based on general knowledge.</p>
                           )}
                        </div>
                    )}
                </div>

                {/* Right Panel - Chat */}
                <div className="w-2/3 flex flex-col">
                    <div className="flex-grow p-6 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                {msg.sender === 'ai' && <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><AiAssistantIcon className="w-5 h-5 text-white"/></div>}
                                <div className={`max-w-xl p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-neutral text-gray-200'}`}>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                             </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0"><AiAssistantIcon className="w-5 h-5 text-white"/></div>
                                <div className="max-w-xl p-3 rounded-lg bg-neutral text-gray-200">
                                   <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div className="p-6 border-t border-neutral">
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                placeholder="Ask a question about the selected asset..."
                                className="flex-grow bg-neutral text-white border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary p-3"
                                disabled={isLoading || !selectedAssetId}
                            />
                            <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition disabled:bg-neutral disabled:cursor-not-allowed">
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiAssistantPage;