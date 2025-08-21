import React, { useState, useCallback } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import AdminDashboard from './components/admin/AdminDashboard';
import UserProfile from './components/profile/UserProfile';
import LoginScreen from './components/auth/LoginScreen';
import Feed from './components/feed/Feed';
import Highlights from './components/layout/Highlights';

export type View = 'feed' | 'admin' | { type: 'profile'; userId: string };

const AppContent: React.FC = () => {
    const { authenticatedUser, users } = useApp();
    const [currentView, setCurrentView] = useState<View>('feed');

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
                return <AdminDashboard setCurrentView={handleSetCurrentView} />;
            case 'feed':
            default:
                return <Feed setCurrentView={handleSetCurrentView} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header setCurrentView={handleSetCurrentView} />
            <div className="container mx-auto px-4 py-6 grid grid-cols-12 gap-8">
                <aside className="col-span-12 md:col-span-3 lg:col-span-2">
                    <Sidebar currentView={currentView} setCurrentView={handleSetCurrentView} />
                </aside>
                <main className="col-span-12 md:col-span-9 lg:col-span-7">
                    {renderView()}
                </main>
                 <aside className="hidden lg:block lg:col-span-3">
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