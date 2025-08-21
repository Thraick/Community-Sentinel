import React from 'react';
import { useApp } from '../../context/AppContext';
import { UsersIcon } from '../ui/Icons';
import { View } from '../../App';
import { UserRole } from '../../types';

interface HeaderProps {
    currentView: View;
    setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
    const { authenticatedUser, logout } = useApp();

    if (!authenticatedUser) return null;

    const handleProfileClick = () => {
        setCurrentView({ type: 'profile', userId: authenticatedUser.id });
    }

    const getNavLinkClass = (view: View) => {
        return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentView === view 
            ? 'bg-indigo-600 text-white' 
            : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`;
    }
    
    const isResolverOrAdmin = authenticatedUser.role === UserRole.RESOLVER || authenticatedUser.role === UserRole.ADMIN;

    return (
        <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <button onClick={() => setCurrentView('feed')} className="flex items-center space-x-2">
                    <UsersIcon className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Community Sentinel</h1>
                </button>

                 <nav className="hidden md:flex items-center space-x-4">
                    <button onClick={() => setCurrentView('feed')} className={getNavLinkClass('feed')}>Feed</button>
                     {isResolverOrAdmin && <button onClick={() => setCurrentView('resolver')} className={getNavLinkClass('resolver')}>Resolver Desk</button>}
                    <button onClick={() => setCurrentView('analytics')} className={getNavLinkClass('analytics')}>Analytics</button>
                    <button onClick={() => setCurrentView('about')} className={getNavLinkClass('about')}>About</button>
                     {authenticatedUser.role === UserRole.ADMIN && <button onClick={() => setCurrentView('admin')} className={getNavLinkClass('admin')}>Admin</button>}
                </nav>

                <div className="flex items-center space-x-4">
                    <button onClick={handleProfileClick} className="flex items-center space-x-2 text-left">
                        <img src={authenticatedUser.avatarUrl} alt={authenticatedUser.name} className="w-10 h-10 rounded-full border-2 border-indigo-200" />
                        <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{authenticatedUser.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">View Profile</p>
                        </div>
                    </button>
                    
                    <button
                        onClick={logout}
                        className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);
