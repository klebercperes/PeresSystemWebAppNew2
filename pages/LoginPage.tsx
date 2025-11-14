import React, { useState } from 'react';
import type { UserRole } from '../types';
import { GoogleIcon, PeresSystemsLogo } from '../components/icons';
import { authService, type LoginCredentials } from '../services/auth';

interface LoginPageProps {
  onLogin: (role: UserRole, token: string) => void;
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTeamLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call FastAPI /api/auth/login endpoint
      const credentials: LoginCredentials = {
        username: email, // FastAPI uses 'username' field (can be email)
        password: password,
      };

      const authResponse = await authService.login(credentials);
      
      // Get user info to determine role
      const user = await authService.getCurrentUser();
      
      // Determine role based on user data or default to 'team'
      // You may need to adjust this based on your user model
      const role: UserRole = 'team'; // Default to team for now
      
      // Store authentication state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      
      // Call parent handler with token
      onLogin(role, authResponse.access_token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth integration would go here
    // For now, this is a placeholder
    setError('Google login not yet implemented. Please use team member login.');
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
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Customer Login */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-center text-neutral dark:text-gray-300">Customer Portal</h3>
            <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4285F4] hover:bg-[#357ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm disabled:opacity-50"
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
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm disabled:opacity-50"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
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
