import React from 'react';
import { useApp } from '../../context/AppContext';
import { UsersIcon } from '../ui/Icons';
import { View } from '../../App';

interface HeaderProps {
    setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentView }) => {
    const { authenticatedUser, logout } = useApp();

    if (!authenticatedUser) return null;

    const handleProfileClick = () => {
        setCurrentView({ type: 'profile', userId: authenticatedUser.id });
    }

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button onClick={() => setCurrentView('feed')} className="flex items-center space-x-2">
                    <UsersIcon className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-slate-800">Community Sentinel</h1>
                </button>

                <div className="flex items-center space-x-4">
                    <button onClick={handleProfileClick} className="flex items-center space-x-2 text-left">
                        <img src={authenticatedUser.avatarUrl} alt={authenticatedUser.name} className="w-10 h-10 rounded-full border-2 border-indigo-200" />
                        <div>
                            <p className="font-semibold text-slate-700">{authenticatedUser.name}</p>
                            <p className="text-sm text-slate-500">View Profile</p>
                        </div>
                    </button>
                    
                    <button
                        onClick={logout}
                        className="bg-slate-200 text-slate-700 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);