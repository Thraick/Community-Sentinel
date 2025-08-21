import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { IssueStatus } from '../../types';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: { status: IssueStatus | 'ALL'; tags: string[] };
    onApplyFilters: (filters: { status: IssueStatus | 'ALL'; tags: string[] }) => void;
    availableTags: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, currentFilters, onApplyFilters, availableTags }) => {
    const [status, setStatus] = useState(currentFilters.status);
    const [selectedTags, setSelectedTags] = useState<string[]>(currentFilters.tags);

    useEffect(() => {
        if (isOpen) {
            setStatus(currentFilters.status);
            setSelectedTags(currentFilters.tags);
        }
    }, [isOpen, currentFilters]);

    const handleApply = () => {
        onApplyFilters({ status, tags: selectedTags });
        onClose();
    };
    
    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filter Issue Reports">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as IssueStatus | 'ALL')}
                        className="w-full p-2 border rounded-md"
                    >
                        <option value="ALL">All Statuses</option>
                        {Object.values(IssueStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto bg-slate-50 p-2 rounded-md">
                        {availableTags.map(tag => (
                            <button key={tag} onClick={() => toggleTag(tag)} className={`rounded-full px-2 py-1 text-xs transition-colors ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
                <Button onClick={onClose} variant="secondary">Cancel</Button>
                <Button onClick={handleApply} variant="primary">Apply Filters</Button>
            </div>
        </Modal>
    );
};

export default FilterModal;