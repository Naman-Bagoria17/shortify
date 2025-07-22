import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaCopy, FaCheck } from 'react-icons/fa';
import { FiShare2, FiX } from 'react-icons/fi';
import Portal from './Portal';

const ShareModal = ({ url, onClose }) => {
    const [copied, setCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const message = encodeURIComponent('Check out this amazing link!');



    const shareLinks = [
        {
            href: `https://api.whatsapp.com/send?text=${message}%20${encodedUrl}`,
            icon: FaWhatsapp,
            label: 'WhatsApp',
            color: '#25D366',
            gradient: 'from-green-500 to-green-600',
        },
        {
            href: `https://twitter.com/intent/tweet?text=${message}&url=${encodedUrl}`,
            icon: FaTwitter,
            label: 'Twitter',
            color: '#1DA1F2',
            gradient: 'from-blue-400 to-blue-500',
        },
        {
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            icon: FaLinkedin,
            label: 'LinkedIn',
            color: '#0077B5',
            gradient: 'from-blue-600 to-blue-700',
        },
        {
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: FaFacebook,
            label: 'Facebook',
            color: '#1877F2',
            gradient: 'from-blue-500 to-blue-600',
        },
        {
            href: `https://www.instagram.com/`,
            icon: FaInstagram,
            label: 'Instagram',
            color: '#E4405F',
            gradient: 'from-pink-500 to-pink-600',
        },
    ];

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const overlayVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        initial: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            rotateX: -15
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            y: 50,
            rotateX: 15,
            transition: {
                duration: 0.2
            }
        }
    };

    const iconVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                delay: 0.2,
                type: "spring",
                damping: 15,
                stiffness: 300
            }
        }
    };

    return (
        <Portal>
            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    variants={overlayVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-md relative"
                        style={{
                            background: 'var(--glass-slate)',
                            backdropFilter: 'var(--backdrop-blur-strong)',
                            border: '1px solid var(--glass-border-bright)',
                            borderRadius: '24px',
                            boxShadow: 'var(--shadow-glass-hover), var(--shadow-neon-bright)',
                            perspective: '1000px',
                            margin: '0 auto'
                        }}
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Neon Top Border */}
                        <div
                            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
                            style={{
                                background: 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)'
                            }}
                        />

                        {/* Close Button */}
                        <motion.button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300"
                            style={{
                                background: 'var(--glass-white)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-secondary)'
                            }}
                            whileHover={{
                                scale: 1.1,
                                backgroundColor: 'var(--glass-slate)',
                                borderColor: 'var(--glass-border-bright)'
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiX className="w-4 h-4" />
                        </motion.button>

                        <div className="p-8">
                            {/* Share Icon */}
                            <motion.div
                                className="flex justify-center mb-6"
                                variants={iconVariants}
                            >
                                <div
                                    className="p-4 rounded-full relative"
                                    style={{
                                        background: 'var(--glass-blue)',
                                        border: '2px solid var(--neon-blue)',
                                        boxShadow: 'var(--shadow-neon)'
                                    }}
                                >
                                    <FiShare2
                                        className="w-8 h-8"
                                        style={{ color: 'var(--neon-blue)' }}
                                    />
                                    {/* Pulsing glow */}
                                    <div
                                        className="absolute inset-0 rounded-full animate-ping"
                                        style={{
                                            background: 'var(--neon-glow-soft)',
                                            animationDuration: '2s'
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Title */}
                            <motion.h3
                                className="text-xl font-semibold text-center mb-2"
                                style={{
                                    fontFamily: 'var(--font-modern)',
                                    color: 'var(--text-primary)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Share this link
                            </motion.h3>

                            <motion.p
                                className="text-center mb-6 text-sm"
                                style={{
                                    fontFamily: 'var(--font-clean)',
                                    color: 'var(--text-secondary)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Choose your preferred platform
                            </motion.p>

                            {/* URL Display & Copy */}
                            <motion.div
                                className="mb-6 p-3 rounded-xl flex items-center gap-3"
                                style={{
                                    background: 'var(--glass-slate)',
                                    border: '1px solid var(--glass-border)',
                                    backdropFilter: 'var(--backdrop-blur)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div
                                    className="flex-1 text-sm truncate"
                                    style={{
                                        color: 'var(--text-secondary)',
                                        fontFamily: 'var(--font-clean)'
                                    }}
                                >
                                    {url}
                                </div>
                                <motion.button
                                    onClick={handleCopyUrl}
                                    className="p-2 rounded-lg transition-all duration-300"
                                    style={{
                                        background: copied ? 'var(--glass-blue)' : 'var(--glass-white)',
                                        border: `1px solid ${copied ? 'var(--neon-blue)' : 'var(--glass-border)'}`,
                                        color: copied ? 'var(--neon-blue)' : 'var(--text-secondary)'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {copied ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
                                </motion.button>
                            </motion.div>

                            {/* Social Share Buttons */}
                            <motion.div
                                className="grid grid-cols-2 gap-3"
                                style={{
                                    gridTemplateColumns: window.innerWidth < 480 ? '1fr' : 'repeat(2, 1fr)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {shareLinks.map(({ href, icon: Icon, label, color }, index) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center p-3 rounded-xl transition-all duration-300 group"
                                        style={{
                                            background: 'var(--glass-white)',
                                            border: '1px solid var(--glass-border)',
                                            backdropFilter: 'var(--backdrop-blur)'
                                        }}
                                        whileHover={{
                                            scale: 1.02,
                                            backgroundColor: 'var(--glass-slate)',
                                            borderColor: 'var(--glass-border-bright)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                    >
                                        <Icon
                                            className="w-5 h-5 mr-3 transition-all duration-300 group-hover:scale-110"
                                            style={{ color }}
                                        />
                                        <span
                                            className="text-sm font-medium"
                                            style={{
                                                color: 'var(--text-secondary)',
                                                fontFamily: 'var(--font-clean)'
                                            }}
                                        >
                                            {label}
                                        </span>
                                    </motion.a>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </Portal>
    );
};

export default ShareModal;
