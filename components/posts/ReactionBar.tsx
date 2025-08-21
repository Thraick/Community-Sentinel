import React from 'react';
import { ReactionType, Reaction } from '../../types';
import { useApp } from '../../context/AppContext';

interface ReactionBarProps {
    reactions: Reaction[];
    onToggleReaction: (reactionType: ReactionType) => void;
}

const ReactionBar: React.FC<ReactionBarProps> = ({ reactions, onToggleReaction }) => {
    const { authenticatedUser } = useApp();

    const reactionCounts = Object.values(ReactionType).reduce((acc, type) => {
        acc[type] = reactions.filter(r => r.type === type).length;
        return acc;
    }, {} as Record<ReactionType, number>);
    
    const currentUserReaction = reactions.find(r => r.userId === authenticatedUser?.id)?.type;

    return (
        <div className="flex space-x-4">
            {Object.values(ReactionType).map(type => {
                 const isSelected = currentUserReaction === type;
                 return (
                    <button
                        key={type}
                        onClick={() => onToggleReaction(type)}
                        className={`flex items-center space-x-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-transform transform hover:scale-110 ${isSelected ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''}`}
                        aria-label={`React with ${type}`}
                    >
                        <span className="text-lg">{type}</span>
                        <span className="text-xs">{reactionCounts[type]}</span>
                    </button>
                 );
            })}
        </div>
    );
};

export default React.memo(ReactionBar);