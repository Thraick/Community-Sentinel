import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

const ReportedIssuesList: React.FC = () => {
    const { issueReports, getUserById, authenticatedUser } = useApp();
    const reported = issueReports.filter(p => p.reports.length > 0).sort((a,b) => b.reports.length - a.reports.length);

    if (reported.length === 0) {
        return <p className="text-slate-500">No issues have been reported.</p>;
    }

    return (
        <div className="space-y-4">
            {reported.map(report => {
                const author = getUserById(report.authorId);
                return (
                    <div key={report.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="text-sm text-slate-600 italic">"{report.text?.substring(0, 100)}..."</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Reported by: {report.isAnonymous ? 'Anonymous' : author?.name || 'Unknown User'}
                                </p>
                            </div>
                            <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">{report.reports.length} Reports</span>
                        </div>
                        <div className="mt-3 border-t border-slate-200 pt-3">
                            <h4 className="font-semibold text-sm text-slate-700 mb-2">Reports:</h4>
                            <ul className="space-y-2">
                                {report.reports.map((r, index) => {
                                    const reporter = getUserById(r.reporterId);
                                    if (!reporter) return null;
                                    const isVisible = authenticatedUser?.role === UserRole.ADMIN || !r.isAnonymous;
                                    return (
                                        <li key={index} className="text-sm bg-white p-2 rounded-md">
                                            <p className="text-slate-600"><strong>Reason:</strong> {r.reason}</p>
                                            <p className="text-xs text-slate-400">
                                                By: {isVisible ? reporter.name : 'Anonymous'}
                                                {authenticatedUser?.role === UserRole.ADMIN && r.isAnonymous && ` (${reporter.name})`}
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

export default ReportedIssuesList;