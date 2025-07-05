import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTwitter, FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';

const ShareModal = ({ url, onClose }) => {
    const encodedUrl = encodeURIComponent(url);
    const message = encodeURIComponent('Check out this link!');

    const iconSize = 28; // size of icons

    const shareLinks = [
        {
            href: `https://api.whatsapp.com/send?text=${message}%20${encodedUrl}`,
            icon: <FaWhatsapp size={iconSize} color="#25D366" />,
            label: 'WhatsApp',
            bgColor: 'hover:bg-green-100',
        },
        {
            href: `https://twitter.com/intent/tweet?text=${message}&url=${encodedUrl}`,
            icon: <FaTwitter size={iconSize} color="#1DA1F2" />,
            label: 'Twitter',
            bgColor: 'hover:bg-blue-100',
        },
        {
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            icon: <FaLinkedin size={iconSize} color="#0077B5" />,
            label: 'LinkedIn',
            bgColor: 'hover:bg-blue-100',
        },
        {
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            icon: <FaFacebook size={iconSize} color="#1877F2" />,
            label: 'Facebook',
            bgColor: 'hover:bg-blue-100',
        },
        {
            href: `https://www.instagram.com/`,
            icon: <FaInstagram size={iconSize} color="#E4405F" />,
            label: 'Instagram',
            bgColor: 'hover:bg-pink-100',
        },
    ];

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white p-6 rounded-2xl shadow-2xl w-80"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()} // prevent modal close on inside click
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        Share this link
                    </h3>
                    <div className="flex justify-between">
                        {shareLinks.map(({ href, icon, label, bgColor }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className={`p-3 rounded-full transition ${bgColor} flex items-center justify-center`}
                                title={label}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-2 px-4 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShareModal;
