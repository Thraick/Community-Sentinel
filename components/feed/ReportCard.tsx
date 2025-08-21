import React, { useState } from 'react';
import { IssueReport, UserRole, IssueStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import ReactionBar from '../posts/ReactionBar';
import CommentSection from '../posts/CommentSection';
import Tag from '../ui/Tag';
import Modal from '../ui/Modal';
import { View } from '../../App';
import { ShareIcon, FacebookIcon, WhatsAppIcon } from '../ui/Icons';

interface ReportCardProps {
    report: IssueReport;
    setCurrentView: (view: View) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, setCurrentView }) => {
    const { authenticatedUser, getUserById, reportIssue, resolveIssue } = useApp();
    const author = getUserById(report.authorId);
    
    const [isReporting, setIsReporting] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportAnonymous, setReportAnonymous] = useState(false);

    const [isResolving, setIsResolving] = useState(false);
    const [resolutionNote, setResolutionNote] = useState('');
    
    const [showShareOptions, setShowShareOptions] = useState(false);

    const handleProfileClick = () => {
        if (!report.isAnonymous && author) {
            setCurrentView({ type: 'profile', userId: author.id });
        }
    };

    const handleReportSubmit = () => {
        if (reportReason.trim()) {
            reportIssue(report.id, { isAnonymous: reportAnonymous, reason: reportReason });
            setIsReporting(false);
            setReportReason('');
            setReportAnonymous(false);
        }
    };
    
    const handleResolveSubmit = () => {
        if (resolutionNote.trim()) {
            resolveIssue(report.id, resolutionNote);
            setIsResolving(false);
            setResolutionNote('');
        }
    }

    const getStatusChip = (status: IssueStatus) => {
        const baseClasses = "text-xs font-bold px-2 py-1 rounded-full";
        switch (status) {
            case IssueStatus.ACTIVE: return `bg-green-100 text-green-800 ${baseClasses}`;
            case IssueStatus.UNDER_REVIEW: return `bg-yellow-100 text-yellow-800 ${baseClasses}`;
            case IssueStatus.RESOLVED: return `bg-blue-100 text-blue-800 ${baseClasses}`;
        }
    }

    if (report.isFromBlockedUser) {
        return (
             <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 text-center">
                 <p className="text-slate-500 italic">{report.text}</p>
             </div>
        )
    }

    const reportAuthor = report.isAnonymous ? { name: 'Anonymous', avatarUrl: 'https://picsum.photos/seed/anonymous/100/100' } : author;
    if (!reportAuthor) return null;

    const canResolve = authenticatedUser && (authenticatedUser.role === UserRole.ADMIN || authenticatedUser.role === UserRole.RESOLVER);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                         <button onClick={handleProfileClick} disabled={report.isAnonymous} className="disabled:cursor-default">
                            <img src={reportAuthor.avatarUrl} alt={reportAuthor.name} className="w-12 h-12 rounded-full" />
                         </button>
                        <div>
                             <button className="font-bold text-slate-800 text-left disabled:cursor-default" onClick={handleProfileClick} disabled={report.isAnonymous}>
                                {reportAuthor.name}
                             </button>
                            <p className="text-xs text-slate-500">{new Date(report.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {report.reports.length > 0 && (
                            <div className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full flex items-center">
                                {report.reports.length} Report{report.reports.length > 1 && 's'}
                            </div>
                        )}
                        <span className={getStatusChip(report.status)}>{report.status}</span>
                    </div>
                </div>

                {report.status === IssueStatus.RESOLVED && report.resolutionNote && (
                     <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md my-4">
                        <p className="font-bold">Resolution Note:</p>
                        <p className="text-sm">{report.resolutionNote}</p>
                    </div>
                )}
                
                {report.text && <p className="text-slate-700 mb-4 whitespace-pre-wrap">{report.text}</p>}
                
                {report.mediaUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                        <img src={report.mediaUrl} alt="Report media" className="w-full h-auto object-cover" />
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                    {report.tags.map(tag => <Tag key={tag} label={tag} />)}
                </div>

                <ReactionBar report={report} />

                <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center text-sm text-slate-500">
                    <button onClick={() => setIsReporting(true)} className="hover:text-red-600 transition-colors">Report Issue</button>
                    {canResolve && report.status !== IssueStatus.RESOLVED &&(
                        <button onClick={() => setIsResolving(true)} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">Resolve</button>
                    )}
                     <div className="relative">
                        <button onClick={() => setShowShareOptions(!showShareOptions)} className="flex items-center space-x-1 hover:text-indigo-600">
                           <ShareIcon className="w-5 h-5" />
                           <span>Share</span>
                        </button>
                        {showShareOptions && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white shadow-lg rounded-md p-2 flex space-x-3 z-10" onMouseLeave={() => setShowShareOptions(false)}>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    <FacebookIcon className="w-6 h-6" />
                                </a>
                                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(report.text || '')} ${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                                    <WhatsAppIcon className="w-6 h-6" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CommentSection reportId={report.id} comments={report.comments} />

            <Modal isOpen={isReporting} onClose={() => setIsReporting(false)} title="Report Issue">
                <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Please provide a reason for reporting..." className="w-full p-2 border rounded-md mb-4 h-28" />
                <div className="flex items-center mb-4">
                    <input type="checkbox" id="anonymous-report" checked={reportAnonymous} onChange={(e) => setReportAnonymous(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor="anonymous-report" className="ml-2 block text-sm text-gray-900">Report Anonymously</label>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsReporting(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleReportSubmit} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300" disabled={!reportReason.trim()}>Submit Report</button>
                </div>
            </Modal>

            <Modal isOpen={isResolving} onClose={() => setIsResolving(false)} title="Resolve Issue">
                <textarea value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} placeholder="Enter resolution note..." className="w-full p-2 border rounded-md mb-4 h-28" />
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsResolving(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleResolveSubmit} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300" disabled={!resolutionNote.trim()}>Mark as Resolved</button>
                </div>
            </Modal>
        </div>
    );
};

export default React.memo(ReportCard);