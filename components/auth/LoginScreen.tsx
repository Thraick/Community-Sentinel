import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Button from '../ui/Button';
import AuthLayout from './AuthLayout';

const LoginScreen: React.FC = () => {
    const { login } = useApp();
    const [email, setEmail] = useState('alice@example.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await login(email, password);
            if (!user) {
                setError('Invalid email, password, or user is blocked.');
            }
        } catch (err) {
            setError('An error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Sign in to your account">
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
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
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
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <Button type="submit" className="w-full flex justify-center" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </div>
                 <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 p-2 rounded-md space-y-1">
                    <p><b>User:</b> alice@example.com / password</p>
                    <p><b>Resolver:</b> resolver@example.com / password</p>
                    <p><b>Admin:</b> admin@example.com / admin</p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginScreen;