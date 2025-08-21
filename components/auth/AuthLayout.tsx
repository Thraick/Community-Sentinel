import React from 'react';
import { UsersIcon } from '../ui/Icons';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center items-center space-x-2">
                    <UsersIcon className="w-10 h-10 text-indigo-600" />
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                        Community Sentinel
                    </h2>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                     <h3 className="text-xl font-bold text-center text-slate-700 dark:text-slate-200 mb-6">{title}</h3>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;