import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import { getAllUserUrls } from '../api/user.api';
import { queryClient } from '../main';
import { deleteShortUrl } from '../api/shortUrl.api';
import { useToast } from '../contexts/ToastContext';
import EnhancedUrlCard from './EnhancedUrlCard';
import { SkeletonList } from './SkeletonLoader';
import DeleteModal from './DeleteModal';
import ShareModal from './ShareModal';

const UserUrls = () => {
    const { data: urls, isLoading, isError, error } = useQuery({
        queryKey: ['userUrls'],
        queryFn: getAllUserUrls,
        refetchInterval: 30000,
        staleTime: 0,
    });

    const [copiedId, setCopiedId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);
    const [shareUrl, setShareUrl] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'clicks'

    const toast = useToast();

    const handleCopy = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const confirmDelete = (id) => {
        setPendingDeleteId(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setDeletingId(pendingDeleteId);
            await deleteShortUrl(pendingDeleteId);
            await queryClient.invalidateQueries({ queryKey: ['userUrls'] });
            setShowConfirm(false);
            toast.success('URL deleted successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to delete URL');
        } finally {
            setDeletingId(null);
            setPendingDeleteId(null);
        }
    };

    // Filter and sort URLs
    const filteredAndSortedUrls = React.useMemo(() => {
        // Handle different data structures - urls might be direct array or nested in urls.urls
        let urlsArray = [];
        if (Array.isArray(urls)) {
            urlsArray = urls;
        } else if (urls && Array.isArray(urls.urls)) {
            urlsArray = urls.urls;
        } else if (urls && Array.isArray(urls.data)) {
            urlsArray = urls.data;
        }

        if (urlsArray.length === 0) return [];

        let filtered = urlsArray.filter(url =>
            url.full_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.short_url?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        let sorted;
        switch (sortBy) {
            case 'oldest':
                sorted = filtered.sort((a, b) => {
                    // Use MongoDB ObjectId timestamp since createdAt is undefined
                    // ObjectId contains timestamp in first 4 bytes
                    const idA = a._id || '';
                    const idB = b._id || '';
                    return idA.localeCompare(idB); // Older ObjectIds come first
                });
                break;
            case 'clicks':
                sorted = filtered.sort((a, b) => {
                    const clicksA = a.clicks || 0;
                    const clicksB = b.clicks || 0;
                    return clicksB - clicksA; // Higher clicks first
                });
                break;
            case 'newest':
            default:
                sorted = filtered.sort((a, b) => {
                    // Use MongoDB ObjectId timestamp since createdAt is undefined
                    // ObjectId contains timestamp in first 4 bytes
                    const idA = a._id || '';
                    const idB = b._id || '';
                    return idB.localeCompare(idA); // Newer ObjectIds come first
                });
                break;
        }

        return sorted;
    }, [urls, searchTerm, sortBy]);

    if (isLoading) {
        return <SkeletonList count={3} className="space-y-4" />;
    }

    if (isError) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl text-red-100"
            >
                <span>Error loading your URLs: {error.message}</span>
            </motion.div>
        );
    }

    if (!urls?.urls || urls.urls.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <div className="glass rounded-xl p-8">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiGrid className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No URLs found</h3>
                    <p className="text-white/70">You haven't created any shortened URLs yet.</p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Controls */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search URLs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:border-white/40 focus:outline-none transition-all duration-300 text-white placeholder-white/50"
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-white/40"
                    >
                        <option value="newest" className="bg-gray-800">Newest First</option>
                        <option value="oldest" className="bg-gray-800">Oldest First</option>
                        <option value="clicks" className="bg-gray-800">Most Clicks</option>
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            <FiGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                ? 'bg-white/20 text-white'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            <FiList className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Results Count */}
            {filteredAndSortedUrls.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/70 text-sm"
                >
                    Showing {filteredAndSortedUrls.length} of {
                        Array.isArray(urls) ? urls.length :
                            Array.isArray(urls?.urls) ? urls.urls.length :
                                Array.isArray(urls?.data) ? urls.data.length : 0
                    } URLs
                </motion.div>
            )}

            {/* URL Cards */}
            <AnimatePresence mode="wait">
                {filteredAndSortedUrls.length === 0 ? (
                    <motion.div
                        key="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                    >
                        <div className="glass rounded-xl p-8">
                            <FiSearch className="w-12 h-12 text-white/50 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No URLs found</h3>
                            <p className="text-white/70">Try adjusting your search terms or filters.</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`grid gap-4 ${viewMode === 'grid'
                            ? 'grid-cols-1 lg:grid-cols-2'
                            : 'grid-cols-1'
                            }`}
                    >
                        {filteredAndSortedUrls.map((url, index) => (
                            <motion.div
                                key={url._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <EnhancedUrlCard
                                    url={url}
                                    onCopy={handleCopy}
                                    onShare={(shareUrl) => setShareUrl(shareUrl)}
                                    onDelete={confirmDelete}
                                    copiedId={copiedId}
                                    deletingId={deletingId}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {showConfirm && (
                    <DeleteModal
                        title="Confirm Deletion"
                        message="Are you sure you want to delete this URL? This action cannot be undone."
                        onCancel={() => {
                            setShowConfirm(false);
                            setPendingDeleteId(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        isDeleting={deletingId !== null}
                    />
                )}

                {shareUrl && (
                    <ShareModal
                        url={shareUrl}
                        onClose={() => setShareUrl(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserUrls;
