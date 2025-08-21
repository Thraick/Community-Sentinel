import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

const ReportedCommentsList: React.FC = () => {
    const { issueReports, getUserById, authenticatedUser } = useApp();

    const reportedComments = issueReports.flatMap(report =>
        report.comments
            .filter(comment => comment.reports.length > 0)
            .map(comment => ({ report, comment }))
    );
    
    if (reportedComments.length === 0) {
        return <p className="text-slate-500 dark:text-slate-400">No comments have been reported.</p>;
    }

    return (
        <div className="space-y-4">
            {reportedComments.map(({ report, comment }) => {
                const commentAuthor = getUserById(comment.authorId);
                return (
                    <div key={comment.id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                         <div className="flex justify-between items-start">
                            <div>
                               <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{comment.text}"</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Comment by: {commentAuthor?.name || 'Unknown'} on issue "{report.text?.substring(0, 30)}..."
                                </p>
                            </div>
                            <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">{comment.reports.length} Reports</span>
                        </div>
                        <div className="mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                             <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-2">Reports:</h4>
                            <ul className="space-y-2">
                                {comment.reports.map((report, index) => {
                                    const reporter = getUserById(report.reporterId);
                                    if (!reporter) return null;
                                    const isVisible = authenticatedUser?.role === UserRole.ADMIN || !report.isAnonymous;
                                    return (
                                        <li key={index} className="text-sm bg-white dark:bg-slate-700 p-2 rounded-md">
                                            <p className="text-slate-600 dark:text-slate-300"><strong>Reason:</strong> {report.reason}</p>
                                            <p className="text-xs text-slate-400">
                                                By: {isVisible ? reporter.name : 'Anonymous'}
                                                {authenticatedUser?.role === UserRole.ADMIN && report.isAnonymous && ` (${reporter.name})`}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReportedCommentsList;