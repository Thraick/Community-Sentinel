import React from 'react';

interface TagProps {
    label: string;
    onRemove?: () => void;
    onClick?: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove, onClick }) => {
    const baseClasses = "bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center";
    const clickableClasses = onClick ? "cursor-pointer hover:bg-indigo-200" : "";

    const content = (
        <>
            {label}
            {onRemove && (
                <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="ml-1.5 text-indigo-400 hover:text-indigo-700 focus:outline-none" aria-label={`Remove tag ${label}`}>
                    &times;
                </button>
            )}
        </>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className={`${baseClasses} ${clickableClasses}`}>
                {content}
            </button>
        );
    }

    return (
        <div className={`${baseClasses} ${clickableClasses}`}>
            {content}
        </div>
    );
};

export default Tag;