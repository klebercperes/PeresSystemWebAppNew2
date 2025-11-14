import React from 'react';
import { PeresSystemsLogo } from './icons';

interface HeaderProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onContactClick?: () => void; // New optional prop
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLoginClick, onLogoutClick, onContactClick }) => {
  return (
    <header className="bg-neutral-light dark:bg-neutral-dark shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <PeresSystemsLogo className="h-10 w-auto text-primary" />
          </div>
          <div className="flex items-center space-x-4">
            {onContactClick && (
                 <button
                    onClick={onContactClick}
                    className="px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-150 ease-in-out"
                >
                    Contact Us
                </button>
            )}
            {isAuthenticated ? (
               <button
                onClick={onLogoutClick}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"
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