
import React, { useState } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';
import { Logo } from './Logo';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onSwitchToSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await authService.login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Logo className="h-10 w-auto text-gray-900 dark:text-gray-100 mx-auto" />
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
            </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </div>
         <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Not a member?{' '}
            <button onClick={onSwitchToSignup} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Create an account
            </button>
        </p>
      </div>
    </div>
  );
};
