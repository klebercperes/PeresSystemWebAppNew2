import React from 'react';
import { PeresSystemsLogo } from './icons';

interface HeaderProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onServicesClick?: () => void;
  onContactClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLoginClick, onLogoutClick, onServicesClick, onContactClick }) => {
  return (
    <header className="bg-blue-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <PeresSystemsLogo className="h-10 w-auto text-white" />
          </div>
          <div className="flex items-center space-x-4">
            {!isAuthenticated && onServicesClick && (
              <button
                onClick={onServicesClick}
                className="px-4 py-2 text-white font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Services
              </button>
            )}
            {!isAuthenticated && onContactClick && (
              <button
                onClick={onContactClick}
                className="px-4 py-2 text-white font-semibold rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Contact
              </button>
            )}
            {isAuthenticated ? (
               <button
                onClick={onLogoutClick}
                className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;