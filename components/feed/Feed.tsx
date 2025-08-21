import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ReportCard from './ReportCard';
import CreateReport from './CreateReport';
import { IssueStatus, User } from '../../types';
import { View } from '../../App';
import Button from '../ui/Button';
import FilterModal from './FilterModal';
import Tag from '../ui/Tag';

const POSTS_PER_PAGE = 10;
type QuickFilter = 'ALL' | 'UNRESOLVED' | 'RESOLVED' | 'ASSIGNED';


interface FeedProps {
    setCurrentView: (view: View) => void;
}

const Feed: React.FC<FeedProps> = ({ setCurrentView }) => {
    const { issueReports, allTags, getUserById } = useApp();
    const [showCreate, setShowCreate] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [visiblePostsCount, setVisiblePostsCount] = useState(POSTS_PER_PAGE);
    const [quickFilter, setQuickFilter] = useState<QuickFilter>('ALL');

    const [filters, setFilters] = useState<{ status: IssueStatus | 'ALL'; tags: string[], startDate: string, endDate: string }>({ 
        status: 'ALL', 
        tags: [],
        startDate: '',
        endDate: '',
    });

    const handleTagClick = useCallback((tag: string) => {
        setFilters({ status: 'ALL', tags: [tag], startDate: '', endDate: '' });
        setSearchQuery('');
        setQuickFilter('ALL');
    }, []);

    const filteredReports = useMemo(() => {
        return issueReports.filter(report => {
            // Quick Filter Logic
            if (quickFilter === 'UNRESOLVED' && report.status === IssueStatus.RESOLVED) return false;
            if (quickFilter === 'RESOLVED' && report.status !== IssueStatus.RESOLVED) return false;
            if (quickFilter === 'ASSIGNED' && !report.resolverId) return false;

            // Advanced Filter Logic
            const statusMatch = filters.status === 'ALL' || report.status === filters.status;
            const tagsMatch = filters.tags.length === 0 || filters.tags.every(tag => report.tags.includes(tag));
            
            const reportDate = new Date(report.timestamp);
            const startDateMatch = !filters.startDate || reportDate >= new Date(filters.startDate);
            const endDateMatch = !filters.endDate || reportDate <= new Date(filters.endDate);

            const searchMatch = !searchQuery || 
                report.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (!report.isAnonymous && getUserById(report.authorId)?.name.toLowerCase().includes(searchQuery.toLowerCase()));

            return statusMatch && tagsMatch && startDateMatch && endDateMatch && searchMatch;
        });
    }, [issueReports, filters, searchQuery, getUserById, quickFilter]);
    
     useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
                 if (visiblePostsCount < filteredReports.length) {
                    setVisiblePostsCount(prevCount => prevCount + POSTS_PER_PAGE);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [visiblePostsCount, filteredReports.length]);

    const handleClearFilters = useCallback(() => {
        setFilters({ status: 'ALL', tags: [], startDate: '', endDate: '' });
        setSearchQuery('');
        setQuickFilter('ALL');
    }, []);
    
    const isFiltered = filters.status !== 'ALL' || filters.tags.length > 0 || filters.startDate || filters.endDate || searchQuery || quickFilter !== 'ALL';

    const getQuickFilterClass = (filter: QuickFilter) => {
        return `px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            quickFilter === filter
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
        }`;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-md space-y-4">
                 <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Community Issue Feed</h2>
                     <div className="space-x-2">
                         <Button onClick={() => setShowCreate(!showCreate)} variant="primary">
                             {showCreate ? 'Cancel' : 'Submit Report'}
                         </Button>
                    </div>
                </div>
                <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <button onClick={() => setQuickFilter('ALL')} className={getQuickFilterClass('ALL')}>All</button>
                    <button onClick={() => setQuickFilter('UNRESOLVED')} className={getQuickFilterClass('UNRESOLVED')}>Unresolved</button>
                    <button onClick={() => setQuickFilter('RESOLVED')} className={getQuickFilterClass('RESOLVED')}>Resolved</button>
                    <button onClick={() => setQuickFilter('ASSIGNED')} className={getQuickFilterClass('ASSIGNED')}>Assigned</button>
                </div>
                 <div className="flex space-x-2">
                    <input 
                        type="text"
                        placeholder="Search reports, tags, or users..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                    <Button onClick={() => setIsFilterOpen(true)} variant="secondary">
                         Filter
                    </Button>
                 </div>
                {isFiltered && (
                    <div className="flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 pt-3">
                         <span className="text-sm font-semibold dark:text-slate-200">Active Filters:</span>
                         <div className="flex flex-wrap gap-2">
                            {quickFilter !== 'ALL' && <Tag label={quickFilter.charAt(0) + quickFilter.slice(1).toLowerCase()} />}
                            {filters.status !== 'ALL' && <Tag label={`Status: ${filters.status}`} />}
                            {filters.tags.map(tag => <Tag key={tag} label={tag} />)}
                            {searchQuery && <Tag label={`Search: "${searchQuery}"`} />}
                         </div>
                         <Button onClick={handleClearFilters} variant="secondary" className="text-xs py-1 ml-auto">Clear All</Button>
                    </div>
                )}
            </div>
            
            {showCreate && <CreateReport onSubmitted={() => setShowCreate(false)} />}
            
            {filteredReports.slice(0, visiblePostsCount).map(report => (
                <ReportCard key={report.id} report={report} setCurrentView={setCurrentView} onTagClick={handleTagClick} />
            ))}

            {visiblePostsCount < filteredReports.length && <p className="text-center text-slate-500">Loading more...</p>}
            {filteredReports.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">No reports match your criteria.</p>}


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