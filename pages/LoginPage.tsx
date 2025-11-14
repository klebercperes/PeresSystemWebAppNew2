import React, { useState } from 'react';
import type { UserRole } from '../types';
import { GoogleIcon, PeresSystemsLogo } from '../components/icons';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTeamLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here.
    // For this demo, any team email/password will work.
    if (email && password) {
      onLogin('team');
    } else {
      alert('Please enter email and password for team login.');
    }
  };

  const handleGoogleLogin = () => {
    // This simulates a successful Google Sign-In for a customer.
    onLogin('customer');
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-dark p-10 rounded-xl shadow-lg">
        <div>
            <PeresSystemsLogo className="mx-auto h-12 w-auto text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-dark dark:text-white">
            Sign in to your account
          </h2>
        </div>
        
        {/* Customer Login */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-center text-neutral dark:text-gray-300">Customer Portal</h3>
            <button
                onClick={handleGoogleLogin}
                type="button"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4285F4] hover:bg-[#357ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition-colors"
            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <GoogleIcon className="h-5 w-5 bg-white rounded-full p-0.5" />
                </span>
                Sign in with Google
            </button>
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-neutral"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-dark text-neutral dark:text-gray-400">
                Or
                </span>
            </div>
        </div>

        {/* Team Member Login */}
        <form className="mt-8 space-y-6" onSubmit={handleTeamLogin}>
           <h3 className="text-lg font-medium text-center text-neutral dark:text-gray-300">Team Member Login</h3>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </button>
          </div>
        </form>

         <div className="text-sm text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToSignup(); }} className="font-medium text-primary hover:text-primary-dark">
              Don't have a client account? Sign Up
            </a>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;