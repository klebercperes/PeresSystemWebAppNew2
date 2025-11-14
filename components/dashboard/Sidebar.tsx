import React from 'react';
import { DashboardIcon, ClientsIcon, TicketsIcon, AssetsIcon, AiAssistantIcon, LogoutIcon, PeresSystemsLogo } from '../icons';

type View = 'dashboard' | 'clients' | 'tickets' | 'assets' | 'ai-assistant';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    onLogout: () => void;
}

const NavItem: React.FC<{
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
    <li>
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={`flex items-center p-3 text-base font-normal rounded-lg transition-colors duration-150 ${
                isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-300 hover:bg-neutral hover:text-white'
            }`}
        >
            <Icon className="w-6 h-6" />
            <span className="ml-3">{label}</span>
        </a>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
    return (
        <aside className="w-64" aria-label="Sidebar">
            <div className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-neutral-dark">
                <div className="p-2 mb-4">
                     <PeresSystemsLogo className="h-12 w-auto text-white" />
                </div>

                <ul className="space-y-2 flex-grow">
                    <NavItem icon={DashboardIcon} label="Dashboard" isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                    <NavItem icon={ClientsIcon} label="Clients" isActive={activeView === 'clients'} onClick={() => setActiveView('clients')} />
                    <NavItem icon={TicketsIcon} label="Tickets" isActive={activeView === 'tickets'} onClick={() => setActiveView('tickets')} />
                    <NavItem icon={AssetsIcon} label="Assets" isActive={activeView === 'assets'} onClick={() => setActiveView('assets')} />
                </ul>

                <div className="pt-4 mt-4 space-y-2 border-t border-neutral">
                     <NavItem icon={AiAssistantIcon} label="AI Assistant" isActive={activeView === 'ai-assistant'} onClick={() => setActiveView('ai-assistant')} />
                     <li>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onLogout();
                            }}
                            className="flex items-center p-3 text-base font-normal text-gray-300 rounded-lg hover:bg-neutral hover:text-white"
                        >
                            <LogoutIcon className="w-6 h-6" />
                            <span className="ml-3">Logout</span>
                        </a>
                    </li>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;