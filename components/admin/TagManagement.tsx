import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Tag from '../ui/Tag';
import Button from '../ui/Button';

const TagManagement: React.FC = () => {
    const { allTags, addTag, removeTag } = useApp();
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim()) {
            const formattedTag = newTag.trim().replace(/\s+/g, '-').toLowerCase();
            addTag(formattedTag);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        if (window.confirm(`Are you sure you want to remove the tag "${tag}"?`)) {
            removeTag(tag);
        }
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Manage Global Tags</h3>
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a new tag (e.g., #new-issue)"
                    className="flex-grow p-2 border rounded-md"
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()}>Add Tag</Button>
            </div>
            {allTags.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                    {allTags.map((tag) => (
                         <Tag key={tag} label={tag} onRemove={() => handleRemoveTag(tag)} />
                    ))}
                </div>
            ) : (
                <p className="text-slate-500">No global tags have been defined yet.</p>
            )}
        </div>
    );
};

export default TagManagement;