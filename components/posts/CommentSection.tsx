import React, { useState } from 'react';
import { Comment } from '../../types';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import { PaperAirplaneIcon } from '../ui/Icons';

interface CommentSectionProps {
    reportId: string;
    comments: Comment[];
}

const SingleComment: React.FC<{ reportId: string; comment: Comment }> = ({ reportId, comment }) => {
    const { getUserById, reportComment } = useApp();
    const author = getUserById(comment.authorId);

    const [isReporting, setIsReporting] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportAnonymous, setReportAnonymous] = useState(false);

    const handleReportSubmit = () => {
        if (reportReason.trim()) {
            reportComment(reportId, comment.id, {
                isAnonymous: reportAnonymous,
                reason: reportReason,
            });
            setIsReporting(false);
            setReportReason('');
            setReportAnonymous(false);
        }
    };
    
    if (!author || author.isBlocked) return null;

    if (comment.text.startsWith('[Comment from blocked user')) {
         return (
             <div className="flex items-start space-x-3 py-3">
                 <div className="w-8 h-8 rounded-full mt-1 bg-slate-200" />
                 <div className="flex-1">
                     <div className="bg-slate-100 rounded-lg p-2">
                         <p className="text-sm text-slate-500 italic">{comment.text}</p>
                     </div>
                 </div>
             </div>
         );
    }

    return (
        <div className="flex items-start space-x-3 py-3">
            <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full mt-1" />
            <div className="flex-1">
                <div className="bg-slate-100 rounded-lg p-2">
                    <p className="font-semibold text-sm text-slate-800">{author.name}</p>
                    <p className="text-sm text-slate-600">{comment.text}</p>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex space-x-2">
                    <span>{new Date(comment.timestamp).toLocaleTimeString()}</span>
                    <button onClick={() => setIsReporting(true)} className="hover:underline">Report</button>
                    {comment.reports.length > 0 && <span className="text-red-500">{comment.reports.length} report{comment.reports.length > 1 && 's'}</span>}
                </div>
            </div>
            <Modal isOpen={isReporting} onClose={() => setIsReporting(false)} title="Report Comment">
                 <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Please provide a reason for reporting..."
                    className="w-full p-2 border rounded-md mb-4 h-28"
                />
                <div className="flex items-center mb-4">
                    <input type="checkbox" id={`anon-comment-${comment.id}`} checked={reportAnonymous} onChange={e => setReportAnonymous(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor={`anon-comment-${comment.id}`} className="ml-2 block text-sm text-gray-900">Report Anonymously</label>
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsReporting(false)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleReportSubmit} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300" disabled={!reportReason.trim()}>Submit Report</button>
                </div>
            </Modal>
        </div>
    );
};

const CommentSection: React.FC<CommentSectionProps> = ({ reportId, comments }) => {
    const { authenticatedUser, addComment } = useApp();
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(reportId, { text: newComment });
            setNewComment('');
        }
    };
    
    if (!authenticatedUser) return null;

    return (
        <div className="bg-slate-50 px-4 sm:px-6 py-4">
            {comments.length > 0 && !showComments && (
                 <button onClick={() => setShowComments(true)} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 mb-2">
                    View all {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </button>
            )}
           
            {showComments && (
                 <>
                    <button onClick={() => setShowComments(false)} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 mb-2">
                        Hide comments
                    </button>
                    <div className="space-y-2 border-t border-slate-200 mt-2 pt-2">
                        {comments.map(comment => <SingleComment key={comment.id} reportId={reportId} comment={comment} />)}
                    </div>
                 </>
            )}
           
            <form onSubmit={handleSubmit} className="flex items-center space-x-3 mt-4">
                <img src={authenticatedUser.avatarUrl} alt={authenticatedUser.name} className="w-8 h-8 rounded-full" />
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-slate-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-700 disabled:text-slate-300" disabled={!newComment.trim()}>
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default React.memo(CommentSection);