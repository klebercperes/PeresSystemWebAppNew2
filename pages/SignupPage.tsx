import React, { useState } from 'react';
import type { Client } from '../types';
import { PeresSystemsLogo } from '../components/icons';

interface SignupPageProps {
  onSignUp: (newClient: Omit<Client, 'id' | 'createdAt'>) => void;
  onNavigateToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignUp, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (formData.password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }
    // We don't use the password in this demo, but we pass the rest
    const { password, ...clientData } = formData;
    onSignUp(clientData);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-dark p-10 rounded-xl shadow-lg">
        <div>
          <PeresSystemsLogo className="mx-auto h-12 w-auto text-primary" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-dark dark:text-white">
            Create a new client account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <input name="companyName" type="text" required value={formData.companyName} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Client" />
            <input name="contactPerson" type="text" required value={formData.contactPerson} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Contact Person" />
            <input name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Email address" />
            <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Phone Number" />
            <input name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-neutral bg-white dark:bg-neutral text-neutral-dark dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Password" />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }} className="font-medium text-primary hover:text-primary-dark">
            Already have an account? Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;