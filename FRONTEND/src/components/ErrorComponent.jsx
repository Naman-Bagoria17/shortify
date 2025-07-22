import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from '@tanstack/react-router';

const ErrorComponent = ({ error, reset }) => {
    const router = useRouter();

    const handleGoHome = () => {
        router.navigate({ to: '/' });
    };

    const handleRefresh = () => {
        if (reset) {
            reset();
        } else {
            window.location.reload();
        }
    };

    const containerVariants = {
        initial: { opacity: 0, y: 50 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
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
        <div 
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                background: 'radial-gradient(ellipse at top, var(--navy-medium) 0%, var(--navy-base) 50%, var(--greyish-black) 100%)'
            }}
        >
            <motion.div
                className="w-full max-w-md text-center"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Error Card */}
                <motion.div
                    className="card p-8"
                    style={{
                        background: 'var(--glass-white)',
                        backdropFilter: 'var(--backdrop-blur-strong)',
                        border: '1px solid var(--glass-border-bright)',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow-glass-hover), var(--shadow-neon-bright)'
                    }}
                >
                    {/* Neon Top Border */}
                    <div 
                        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
                        style={{
                            background: 'linear-gradient(90deg, transparent, #ef4444, transparent)'
                        }}
                    />

                    {/* Error Icon */}
                    <motion.div
                        className="flex justify-center mb-6"
                        variants={iconVariants}
                    >
                        <div 
                            className="p-4 rounded-full relative"
                            style={{
                                background: 'var(--glass-white)',
                                border: '2px solid #ef4444',
                                boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                            }}
                        >
                            <FiAlertTriangle 
                                className="w-12 h-12" 
                                style={{ color: '#ef4444' }}
                            />
                            {/* Pulsing glow */}
                            <div 
                                className="absolute inset-0 rounded-full animate-ping"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    animationDuration: '2s'
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Error Title */}
                    <motion.h1
                        className="text-2xl font-bold mb-4"
                        style={{
                            fontFamily: 'var(--font-futuristic)',
                            color: 'var(--text-primary)'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Oops! Something went wrong
                    </motion.h1>

                    {/* Error Message */}
                    <motion.p
                        className="mb-6 leading-relaxed"
                        style={{
                            fontFamily: 'var(--font-clean)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem'
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {error?.message || 'An unexpected error occurred. Please try again.'}
                    </motion.p>

                    {/* Error Details (Development only) */}
                    {import.meta.env.DEV && error?.stack && (
                        <motion.details
                            className="mb-6 text-left"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <summary 
                                className="cursor-pointer text-sm mb-2"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Error Details (Dev Mode)
                            </summary>
                            <pre 
                                className="text-xs p-3 rounded-lg overflow-auto max-h-32"
                                style={{
                                    background: 'var(--glass-slate)',
                                    color: 'var(--text-secondary)',
                                    fontFamily: 'monospace'
                                }}
                            >
                                {error.stack}
                            </pre>
                        </motion.details>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        className="flex gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        {/* Refresh Button */}
                        <motion.button
                            onClick={handleRefresh}
                            className="flex-1 btn-secondary py-3 px-6 font-medium flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiRefreshCw className="w-4 h-4" />
                            Try Again
                        </motion.button>

                        {/* Home Button */}
                        <motion.button
                            onClick={handleGoHome}
                            className="flex-1 btn-gradient py-3 px-6 font-medium flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiHome className="w-4 h-4" />
                            Go Home
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Additional Help Text */}
                <motion.p
                    className="mt-6 text-sm"
                    style={{
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-clean)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    If the problem persists, please contact support.
                </motion.p>
            </motion.div>
        </div>
    );
};

export default ErrorComponent;
