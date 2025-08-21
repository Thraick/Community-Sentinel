import React from 'react';
import { IssueReport, ReactionType } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReactionBarProps {
    report: IssueReport;
}

const ReactionBar: React.FC<ReactionBarProps> = ({ report }) => {
    const { authenticatedUser, toggleReaction } = useApp();

    const reactionCounts = Object.values(ReactionType).reduce((acc, type) => {
        acc[type] = report.reactions.filter(r => r.type === type).length;
        return acc;
    }, {} as Record<ReactionType, number>);
    
    const currentUserReaction = report.reactions.find(r => r.userId === authenticatedUser?.id)?.type;

    return (
        <div className="flex justify-between items-center border-t border-b border-slate-200 py-2 my-2">
            <div className="flex space-x-4">
                {Object.values(ReactionType).map(type => {
                     const isSelected = currentUserReaction === type;
                     return (
                        <button
                            key={type}
                            onClick={() => toggleReaction(report.id, type)}
                            className={`flex items-center space-x-1 text-slate-500 hover:text-slate-800 transition-transform transform hover:scale-110 ${isSelected ? 'text-indigo-600 font-bold' : ''}`}
                            aria-label={`React with ${type}`}
                        >
                            <span className="text-xl">{type}</span>
                            <span className="text-sm">{reactionCounts[type]}</span>
                        </button>
                     );
                })}
            </div>
            <div className="text-sm text-slate-500">
                {report.comments.length} Comment{report.comments.length !== 1 && 's'}
            </div>
        </div>
    );
};

export default React.memo(ReactionBar);