import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        // Always show first page
        if (totalPages > 0) pages.push(1);
        
        // Ellipsis logic
        if (currentPage > 3) pages.push('...');
        
        // Show pages around current page
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - 2) pages.push('...');

        // Always show last page
        if (totalPages > 1) pages.push(totalPages);
        
        return [...new Set(pages)]; // Remove duplicates
    };

    return (
        <nav className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 sm:px-6 mt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-md text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            &laquo;
                        </button>
                        {getPageNumbers().map((page, index) =>
                            typeof page === 'number' ? (
                                <button
                                    key={`${page}-${index}`}
                                    onClick={() => onPageChange(page)}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium ${currentPage === page
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-500 dark:text-white'
                                            : 'bg-white dark:bg-slate-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-gray-700 dark:text-slate-300">
                                    {page}
                                </span>
                            )
                        )}
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            &raquo;
                        </button>
                    </nav>
                </div>
            </div>
        </nav>
    );
};

export default Pagination;
