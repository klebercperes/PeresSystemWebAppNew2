
import React from 'react';
import { View } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { UsersIcon } from './icons/UsersIcon';
import { TicketIcon } from './icons/TicketIcon';
import { DesktopIcon } from './icons/DesktopIcon';
import { SparklesIcon } from './icons/SparklesIcon';


interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'bg-blue-600 text-white';
  const inactiveClasses = 'text-gray-400 hover:text-white hover:bg-gray-700';

  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center p-2 text-base font-normal rounded-lg w-full text-left transition duration-75 ${isActive ? activeClasses : inactiveClasses}`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    </li>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, isAdmin = false }) => {
  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 h-full bg-gray-800 rounded-r-lg">
        <div className="flex items-center pl-2.5 mb-5">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">PS</span>
            </div>
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Peres Systems</span>
        </div>
        <ul className="space-y-2">
          <NavItem
            icon={<DashboardIcon />}
            label="Dashboard"
            isActive={currentView === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          {isAdmin && (
            <NavItem
              icon={<UsersIcon />}
              label="Clients"
              isActive={currentView === 'clients'}
              onClick={() => onNavigate('clients')}
            />
          )}
          <NavItem
            icon={<TicketIcon />}
            label="Tickets"
            isActive={currentView === 'tickets'}
            onClick={() => onNavigate('tickets')}
          />
          <NavItem
            icon={<DesktopIcon />}
            label="Assets"
            isActive={currentView === 'assets'}
            onClick={() => onNavigate('assets')}
          />
        </ul>
        {isAdmin && (
          <div className="pt-4 mt-4 space-y-2 border-t border-gray-700">
            <NavItem
              icon={<UsersIcon />}
              label="Users"
              isActive={currentView === 'users'}
              onClick={() => onNavigate('users')}
            />
          </div>
        )}
        <div className="pt-4 mt-4 space-y-2 border-t border-gray-700">
            <NavItem
                icon={<SparklesIcon />}
                label="AI Assistant"
                isActive={currentView === 'ai-assistant'}
                onClick={() => onNavigate('ai-assistant')}
            />
        </div>
        <div className="pt-4 mt-4 space-y-2 border-t border-gray-700">
          <li>
            <button
              onClick={onLogout}
              className="flex items-center p-2 text-base font-normal rounded-lg w-full text-left text-gray-400 hover:text-white hover:bg-gray-700 transition duration-75"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="ml-3">Logout</span>
            </button>
          </li>
        </div>
      </div>
    </aside>
  );
};
