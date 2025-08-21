import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { View } from '../../App';
import { HomeIcon, ShieldExclamationIcon, UserIcon } from '../ui/Icons';

interface SidebarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    roles: UserRole[];
    getView: (userId: string) => View;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
    const { authenticatedUser } = useApp();

    if (!authenticatedUser) return null;

    const navItems: NavItem[] = [
        { id: 'feed', label: 'Issue Feed', icon: <HomeIcon className="w-6 h-6" />, roles: [UserRole.USER, UserRole.RESOLVER, UserRole.ADMIN], getView: () => 'feed' },
        { id: 'profile', label: 'My Profile', icon: <UserIcon className="w-6 h-6" />, roles: [UserRole.USER, UserRole.RESOLVER, UserRole.ADMIN], getView: (userId) => ({ type: 'profile', userId }) },
        { id: 'admin', label: 'Dashboard', icon: <ShieldExclamationIcon className="w-6 h-6" />, roles: [UserRole.ADMIN, UserRole.RESOLVER], getView: () => 'admin' },
    ];

    const isCurrentView = (item: NavItem) => {
        const itemView = item.getView(authenticatedUser.id);
        if (typeof currentView === 'object' && typeof itemView === 'object') {
            return currentView.type === itemView.type && currentView.userId === itemView.userId;
        }
        return currentView === itemView;
    };

    const getNavItemClass = (item: NavItem) => {
        return `flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
            isCurrentView(item)
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
        }`;
    };

    return (
        <nav className="sticky top-24 bg-white p-4 rounded-lg shadow-md">
            <ul className="space-y-2">
                {navItems.map(item =>
                    item.roles.includes(authenticatedUser.role) && (
                        <li key={item.id}>
                            <button onClick={() => setCurrentView(item.getView(authenticatedUser.id))} className={`${getNavItemClass(item)} w-full`}>
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        </li>
                    )
                )}
            </ul>
        </nav>
    );
};

export default React.memo(Sidebar);