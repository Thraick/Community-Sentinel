import React, { useState, useCallback, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import AdminDashboard from './components/admin/AdminDashboard';
import UserProfile from './components/profile/UserProfile';
import LoginScreen from './components/auth/LoginScreen';
import Feed from './components/feed/Feed';
import Highlights from './components/layout/Highlights';
import AnalyticsPage from './components/pages/AnalyticsPage';
import AboutPage from './components/pages/AboutPage';
import ResolverDashboard from './components/resolver/ResolverDashboard';
import { UserRole } from './types';

export type View = 'feed' | 'admin' | 'resolver' | 'analytics' | 'about' | { type: 'profile'; userId: string };

const AppContent: React.FC = () => {
    const { authenticatedUser, users } = useApp();
    const [currentView, setCurrentView] = useState<View>('feed');

    useEffect(() => {
        if (authenticatedUser?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [authenticatedUser]);


    const handleSetCurrentView = useCallback((view: View) => {
        setCurrentView(view);
    }, []);

    if (!authenticatedUser) {
        return <LoginScreen />;
    }

    const renderView = () => {
        if (typeof currentView === 'object' && currentView.type === 'profile') {
            const userToShow = users.find(u => u.id === currentView.userId);
            return userToShow ? <UserProfile user={userToShow} setCurrentView={handleSetCurrentView} /> : <p>User not found.</p>;
        }

        switch (currentView) {
            case 'admin':
                 if (authenticatedUser.role === UserRole.ADMIN || authenticatedUser.role === UserRole.RESOLVER) {
                    return <AdminDashboard setCurrentView={handleSetCurrentView} />;
                }
                break;
            case 'resolver':
                 if (authenticatedUser.role === UserRole.ADMIN || authenticatedUser.role === UserRole.RESOLVER) {
                    return <ResolverDashboard setCurrentView={handleSetCurrentView} />;
                }
                break;
            case 'analytics':
                return <AnalyticsPage />;
            case 'about':
                return <AboutPage />;
            case 'feed':
            default:
                return <Feed setCurrentView={handleSetCurrentView} />;
        }
        
        // Fallback for unauthorized access or default view
        return <Feed setCurrentView={handleSetCurrentView} />;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-800 font-sans">
            <Header currentView={currentView} setCurrentView={handleSetCurrentView} />
            <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <main className="lg:col-span-8">
                    {renderView()}
                </main>
                 <aside className="hidden lg:block lg:col-span-4">
                    <Highlights setCurrentView={handleSetCurrentView} />
                </aside>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
