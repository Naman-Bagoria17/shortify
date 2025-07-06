import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCheck, FiShare2, FiTrash2, FiExternalLink, FiBarChart, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import AnimatedButton from './AnimatedButton';

const EnhancedUrlCard = ({
  url,
  onCopy,
  onShare,
  onDelete,
  copiedId,
  deletingId
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const toast = useToast();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const analyticsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  const baseShortUrl = `${window.location.origin}/${url.short_url}`;

  const handleCopy = () => {
    onCopy(baseShortUrl, url._id);
    toast.success('URL copied to clipboard!');
  };

  const handleShare = () => {
    onShare(baseShortUrl);
  };

  const handleDelete = () => {
    onDelete(url._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getClicksColor = (clicks) => {
    if (clicks === 0) return 'from-gray-400 to-gray-500';
    if (clicks < 10) return 'from-blue-400 to-blue-500';
    if (clicks < 50) return 'from-green-400 to-green-500';
    if (clicks < 100) return 'from-yellow-400 to-yellow-500';
    return 'from-purple-400 to-purple-500';
  };

  return (
    <motion.div
      className="glass rounded-xl overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      {/* Main Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg mb-1 truncate">
              {url.full_url.length > 50
                ? `${url.full_url.substring(0, 50)}...`
                : url.full_url
              }
            </h3>
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <FiCalendar className="w-4 h-4" />
              <span>Created {formatDate(url.createdAt || Date.now())}</span>
            </div>
          </div>

          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiBarChart className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>

        {/* Short URL Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <FiExternalLink className="w-4 h-4 text-white/70 flex-shrink-0" />
              <a
                href={baseShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-300 transition-colors truncate font-mono"
              >
                {window.location.origin.replace(/^https?:\/\//, '')}/{url.short_url}
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getClicksColor(url.clicks)} text-white text-sm font-medium flex items-center space-x-1`}>
              <FiTrendingUp className="w-4 h-4" />
              <span>{url.clicks} {url.clicks === 1 ? 'click' : 'clicks'}</span>
            </div>
          </div>

          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            {showAnalytics ? 'Hide' : 'Show'} Analytics
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            icon={copiedId === url._id ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
            className="flex-1"
          >
            {copiedId === url._id ? 'Copied!' : 'Copy'}
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={handleShare}
            icon={<FiShare2 className="w-4 h-4" />}
            className="flex-1"
          >
            Share
          </AnimatedButton>

          <AnimatedButton
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={deletingId === url._id}
            icon={<FiTrash2 className="w-4 h-4" />}
            disabled={deletingId === url._id}
          >
            {deletingId === url._id ? 'Deleting...' : 'Delete'}
          </AnimatedButton>
        </div>
      </div>

      {/* Analytics Section */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            variants={analyticsVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="border-t border-white/20 bg-white/5 backdrop-blur-sm"
          >
            <div className="p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <FiBarChart className="w-5 h-5" />
                <span>Analytics</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm mb-1">Total Clicks</div>
                  <div className="text-white text-xl font-bold">{url.clicks}</div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm mb-1">Click Rate</div>
                  <div className="text-white text-xl font-bold">
                    {url.clicks > 0 ? '100%' : '0%'}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm mb-1">Last Clicked</div>
                  <div className="text-white text-sm">
                    {url.clicks > 0 ? 'Recently' : 'Never'}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-sm mb-1">Status</div>
                  <div className="text-green-400 text-sm font-medium">Active</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedUrlCard;
