import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import ReportedIssuesList from './ReportedIssuesList';
import ReportedCommentsList from './ReportedCommentsList';
import UserList from './UserList';
import TagManagement from './TagManagement';
import { View } from '../../App';

type AdminTab = 'issues' | 'comments' | 'users' | 'tags';

interface AdminDashboardProps {
    setCurrentView: (view: View) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentView }) => {
    const { authenticatedUser } = useApp();
    const [activeTab, setActiveTab] = useState<AdminTab>('issues');

    if (!authenticatedUser || (authenticatedUser.role !== UserRole.ADMIN && authenticatedUser.role !== UserRole.RESOLVER)) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-slate-600 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const getTabClass = (tab: AdminTab) => {
         return `px-4 py-2 font-semibold rounded-t-lg transition-colors ${
             activeTab === tab 
             ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' 
             : 'text-slate-500 hover:bg-slate-100'
         }`;
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Moderation Dashboard</h2>
            
            <div className="border-b border-slate-200 mb-4">
                <nav className="-mb-px flex space-x-4">
                    <button onClick={() => setActiveTab('issues')} className={getTabClass('issues')}>Reported Issues</button>
                    <button onClick={() => setActiveTab('comments')} className={getTabClass('comments')}>Reported Comments</button>
                    {authenticatedUser.role === UserRole.ADMIN && (
                        <>
                            <button onClick={() => setActiveTab('users')} className={getTabClass('users')}>User Management</button>
                            <button onClick={() => setActiveTab('tags')} className={getTabClass('tags')}>Tag Management</button>
                        </>
                    )}
                </nav>
            </div>

            <div>
                {activeTab === 'issues' && <ReportedIssuesList />}
                {activeTab === 'comments' && <ReportedCommentsList />}
                {activeTab === 'users' && authenticatedUser.role === UserRole.ADMIN && <UserList setCurrentView={setCurrentView} />}
                {activeTab === 'tags' && authenticatedUser.role === UserRole.ADMIN && <TagManagement />}
            </div>
        </div>
    );
};

export default AdminDashboard;