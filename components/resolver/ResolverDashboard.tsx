import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueStatus, IssueReport, UserRole } from '../../types';
import { View } from '../../App';
import ReportCard from '../feed/ReportCard';
import Pagination from '../ui/Pagination';

type ResolverTab = 'unassigned' | 'my_active' | 'my_resolved';
const REPORTS_PER_PAGE = 5;

interface ResolverDashboardProps {
    setCurrentView: (view: View) => void;
}

const ResolverDashboard: React.FC<ResolverDashboardProps> = ({ setCurrentView }) => {
    const { authenticatedUser, issueReports } = useApp();
    const [activeTab, setActiveTab] = useState<ResolverTab>('unassigned');
    const [currentPage, setCurrentPage] = useState(1);

    const handleTagClick = (tag: string) => {
        alert(`Filtering by tag: ${tag} is not yet implemented in this view.`);
    };

    const filteredReports = useMemo(() => {
        if (!authenticatedUser) return [];
        let reports: IssueReport[] = [];

        switch (activeTab) {
            case 'unassigned':
                reports = issueReports.filter(r => r.status === IssueStatus.ACTIVE && !r.resolverId);
                break;
            case 'my_active':
                 reports = issueReports.filter(r => 
                    r.resolverId === authenticatedUser.id && 
                    (r.status === IssueStatus.IN_PROGRESS || r.status === IssueStatus.UNDER_REVIEW)
                );
                break;
            case 'my_resolved':
                reports = issueReports.filter(r => r.resolverId === authenticatedUser.id && r.status === IssueStatus.RESOLVED);
                break;
            default:
                reports = [];
        }
        return reports;
    }, [issueReports, activeTab, authenticatedUser]);

    const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
    const paginatedReports = filteredReports.slice((currentPage - 1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE);

    const handleTabChange = (tab: ResolverTab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset to first page on tab change
    };

    if (!authenticatedUser || (authenticatedUser.role !== UserRole.ADMIN && authenticatedUser.role !== UserRole.RESOLVER)) {
        return (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const getTabClass = (tab: ResolverTab) => {
         return `px-4 py-2 font-semibold rounded-t-lg transition-colors ${
             activeTab === tab 
             ? 'bg-white dark:bg-slate-900 border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' 
             : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
         }`;
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Resolver Desk</h2>
            
            <div className="border-b border-slate-200 dark:border-slate-700 mb-4">
                <nav className="-mb-px flex space-x-4">
                    <button onClick={() => handleTabChange('unassigned')} className={getTabClass('unassigned')}>Unassigned</button>
                    <button onClick={() => handleTabChange('my_active')} className={getTabClass('my_active')}>My Active Reports</button>
                    <button onClick={() => handleTabChange('my_resolved')} className={getTabClass('my_resolved')}>My Resolved Reports</button>
                </nav>
            </div>

            <div className="space-y-6">
                {paginatedReports.length > 0 ? (
                    paginatedReports.map(report => (
                        <ReportCard key={report.id} report={report} setCurrentView={setCurrentView} onTagClick={handleTagClick} />
                    ))
                ) : (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-8">No reports found in this category.</p>
                )}
                
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default ResolverDashboard;
