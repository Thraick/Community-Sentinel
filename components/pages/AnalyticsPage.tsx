import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueStatus } from '../../types';

const StatCard: React.FC<{ title: string; value: number | string; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-slate-100 dark:bg-slate-800 p-4 rounded-lg shadow ${className}`}>
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
);

const ReportsByStatusChart: React.FC<{ data: { [key in IssueStatus]: number } }> = ({ data }) => {
    const statuses = Object.values(IssueStatus);
    const maxValue = Math.max(...Object.values(data), 1); // Avoid division by zero
    
    const statusColors: { [key in IssueStatus]: string } = {
        [IssueStatus.ACTIVE]: 'bg-green-500',
        [IssueStatus.IN_PROGRESS]: 'bg-purple-500',
        [IssueStatus.UNDER_REVIEW]: 'bg-yellow-500',
        [IssueStatus.RESOLVED]: 'bg-blue-500',
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Reports by Status</h3>
            <div className="space-y-4">
                {statuses.map(status => (
                    <div key={status} className="flex items-center">
                        <span className="w-32 text-sm text-slate-600 dark:text-slate-300">{status}</span>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                            <div
                                className={`${statusColors[status]} h-6 rounded-full text-white text-xs font-bold flex items-center justify-end pr-2`}
                                style={{ width: `${(data[status] / maxValue) * 100}%` }}
                            >
                                {data[status]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AnalyticsPage: React.FC = () => {
    const { issueReports, users } = useApp();

    const stats = useMemo(() => {
        const reportCount = issueReports.length;
        const userCount = users.length;
        const commentCount = issueReports.reduce((acc, report) => acc + report.comments.length, 0);

        const reportsByStatus = issueReports.reduce((acc, report) => {
            acc[report.status] = (acc[report.status] || 0) + 1;
            return acc;
        }, {} as { [key in IssueStatus]: number });
        
        // Ensure all statuses have a value
        Object.values(IssueStatus).forEach(status => {
            if (!reportsByStatus[status]) {
                reportsByStatus[status] = 0;
            }
        });

        return { reportCount, userCount, commentCount, reportsByStatus };
    }, [issueReports, users]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics Dashboard</h2>
            </div>
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Reports" value={stats.reportCount} />
                <StatCard title="Total Users" value={stats.userCount} />
                <StatCard title="Total Comments" value={stats.commentCount} />
            </div>

            <ReportsByStatusChart data={stats.reportsByStatus} />
        </div>
    );
};

export default AnalyticsPage;
