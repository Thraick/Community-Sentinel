import React, { useState, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import ReportCard from './ReportCard';
import CreateReport from './CreateReport';
import { IssueStatus } from '../../types';
import { View } from '../../App';
import Button from '../ui/Button';
import FilterModal from './FilterModal';
import Tag from '../ui/Tag';

interface FeedProps {
    setCurrentView: (view: View) => void;
}

const Feed: React.FC<FeedProps> = ({ setCurrentView }) => {
    const { issueReports, allTags } = useApp();
    const [showCreate, setShowCreate] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<{ status: IssueStatus | 'ALL'; tags: string[] }>({ status: 'ALL', tags: [] });

    const filteredReports = useMemo(() => {
        return issueReports.filter(report => {
            const statusMatch = filters.status === 'ALL' || report.status === filters.status;
            const tagsMatch = filters.tags.length === 0 || filters.tags.every(tag => report.tags.includes(tag));
            return statusMatch && tagsMatch;
        });
    }, [issueReports, filters]);

    const handleClearFilters = useCallback(() => {
        setFilters({ status: 'ALL', tags: [] });
    }, []);
    
    const isFiltered = filters.status !== 'ALL' || filters.tags.length > 0;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Community Issue Feed</h2>
                     <div className="space-x-2">
                         <Button onClick={() => setShowCreate(!showCreate)} variant="primary">
                             {showCreate ? 'Cancel' : 'Submit Report'}
                         </Button>
                         <Button onClick={() => setIsFilterOpen(true)} variant="secondary">
                             Filter
                         </Button>
                    </div>
                </div>
                {isFiltered && (
                    <div className="mt-4 flex items-center gap-2 border-t pt-3">
                         <span className="text-sm font-semibold">Active Filters:</span>
                         <div className="flex flex-wrap gap-2">
                            {filters.status !== 'ALL' && <Tag label={`Status: ${filters.status}`} />}
                            {filters.tags.map(tag => <Tag key={tag} label={tag} />)}
                         </div>
                         <Button onClick={handleClearFilters} variant="secondary" className="text-xs py-1 ml-auto">Clear</Button>
                    </div>
                )}
            </div>
            
            {showCreate && <CreateReport onSubmitted={() => setShowCreate(false)} />}
            
            {filteredReports.map(report => (
                <ReportCard key={report.id} report={report} setCurrentView={setCurrentView} />
            ))}

            <FilterModal 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentFilters={filters}
                onApplyFilters={setFilters}
                availableTags={allTags}
            />
        </div>
    );
};

export default Feed;