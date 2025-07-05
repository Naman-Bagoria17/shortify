import React, { useState, useEffect } from 'react';
import { createShortUrl } from '../api/shortUrl.api';
import { useSelector } from 'react-redux';
import { queryClient } from '../main';
import { motion, AnimatePresence } from 'framer-motion';
import ShareModal from './ShareModal';
import { FiShare2, FiCopy, FiCheck, FiLink, FiLoader, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const UrlForm = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [customSlug, setCustomSlug] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const validateUrl = (urlString) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  useEffect(() => {
    document.getElementById('url')?.focus();
  }, []);

  useEffect(() => {
    setIsValidUrl(validateUrl(url));
  }, [url]);

  const handleSubmit = async () => {
    if (!isValidUrl) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const shortUrl = await createShortUrl(url, customSlug);
      setShortUrl(shortUrl);
      queryClient.invalidateQueries({ queryKey: ['userUrls'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div layout className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Shorten Your URL
          </h2>
          <p className="text-white/80">
            Transform long URLs into short, shareable links
          </p>
        </div>

        <div className="relative">
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            required
            className={`w-full px-5 py-4 pr-12 rounded-xl border-2 transition-all duration-300 text-gray-800 placeholder-gray-500 ${url && !isValidUrl
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : url && isValidUrl
                ? 'border-green-400 focus:border-green-500 focus:ring-green-200'
                : 'border-white/30 focus:border-white/50'
              } focus:outline-none focus:ring-4 focus:ring-opacity-20 bg-white/90 backdrop-blur-sm`}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {url && (
              isValidUrl ? (
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <FiAlertCircle className="w-5 h-5 text-red-500" />
              )
            )}
          </div>
        </div>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <input
              type="text"
              id="customSlug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="custom-slug (optional)"
              className="w-full px-5 py-3 rounded-xl border-2 border-white/30 focus:border-white/50 focus:outline-none focus:ring-4 focus:ring-white/20 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500"
            />
          </motion.div>
        )}

        <motion.button
          onClick={handleSubmit}
          disabled={!isValidUrl || isLoading}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: isValidUrl && !isLoading ? 1.02 : 1 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${isValidUrl && !isLoading
            ? 'btn-gradient hover:shadow-xl cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {isLoading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FiLink className="w-5 h-5" />
              <span>Generate Short URL</span>
            </>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center space-x-2 p-4 bg-rose-400/20 backdrop-blur-sm border border-rose-300/30 rounded-xl text-rose-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {showSuccess && (
          <motion.div
            className="flex items-center space-x-2 p-4 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl text-green-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>Short URL generated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shortUrl && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Your Short URL is Ready!
              </h3>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-full">
                  <input
                    type="text"
                    readOnly
                    value={shortUrl}
                    className="w-full p-3 bg-white/90 backdrop-blur-sm text-gray-800 font-medium rounded-lg border-2 border-transparent focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  onClick={handleCopy}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${copied
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </motion.button>

                <motion.button
                  onClick={() => setIsShareOpen(true)}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-white/20 text-white hover:bg-white/30 rounded-lg font-medium transition-all duration-300"
                >
                  <FiShare2 className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isShareOpen && (
          <ShareModal url={shortUrl} onClose={() => setIsShareOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UrlForm;
