import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { View } from '../../App';
import { IssueReport, User } from '../../types';

interface HighlightsProps {
    setCurrentView: (view: View) => void;
}

const Highlights: React.FC<HighlightsProps> = ({ setCurrentView }) => {
    const { issueReports, getUserById } = useApp();

    const topActiveReports = useMemo(() => {
        return [...issueReports]
            .filter(r => !r.isFromBlockedUser)
            .sort((a, b) => (b.reactions.length + b.comments.length) - (a.reactions.length + a.comments.length))
            .slice(0, 5);
    }, [issueReports]);

    const topFans = useMemo(() => {
        const commentCounts = new Map<string, number>();
        issueReports.forEach(report => {
            report.comments.forEach(comment => {
                const user = getUserById(comment.authorId);
                if (user && !user.isBlocked) {
                    commentCounts.set(comment.authorId, (commentCounts.get(comment.authorId) || 0) + 1);
                }
            });
        });
        return Array.from(commentCounts.entries())
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 5)
            .map(([userId]) => getUserById(userId))
            .filter((user): user is User => !!user);
    }, [issueReports, getUserById]);
    
    // In a real app, you would have a way to navigate to a specific post.
    const handleReportClick = (report: IssueReport) => {
        alert(`Navigating to report: "${report.text?.substring(0, 30)}..." \n(This is a demo action)`);
    };

    return (
        <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Top Active Issues</h3>
                <ul className="space-y-3">
                    {topActiveReports.map(report => (
                        <li key={report.id}>
                            <button onClick={() => handleReportClick(report)} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer text-left">
                                {report.text ? `${report.text.substring(0, 50)}...` : 'Media Report'}
                            </button>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {report.reactions.length} reactions, {report.comments.length} comments
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
             <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Top Fans</h3>
                <ul className="space-y-2">
                   {topFans.map(user => (
                       <li key={user.id}>
                           <button onClick={() => setCurrentView({ type: 'profile', userId: user.id })} className="flex items-center space-x-2 w-full text-left p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                               <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                               <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.name}</span>
                           </button>
                       </li>
                   ))}
                </ul>
            </div>
        </div>
    );
};

export default React.memo(Highlights);