import React from 'react';

interface TagProps {
    label: string;
    onRemove?: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove }) => {
    return (
        <div className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
            {label}
            {onRemove && (
                <button onClick={onRemove} className="ml-1.5 text-indigo-400 hover:text-indigo-700 focus:outline-none" aria-label={`Remove tag ${label}`}>
                    &times;
                </button>
            )}
        </div>
    );
};

export default Tag;