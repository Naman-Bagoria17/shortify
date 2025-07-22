import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiX, FiLock } from 'react-icons/fi';

const LogoutModal = ({ onConfirm, onCancel }) => {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timeout);
    }, []);

    const handleLogout = async () => {
        if (!password.trim()) {
            setError('Password is required.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await onConfirm(password); // throws if wrong password
        } catch (err) {
            setError(err?.response?.data?.message || 'Logout failed');
        } finally {
            setLoading(false); // keep modal open to show error
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
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100vw',
                    height: '100vh'
                }}
                variants={overlayVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={onCancel}
            >
                <motion.div
                    className="modal w-full max-w-md relative"
                    style={{
                        background: 'var(--glass-white)',
                        backdropFilter: 'var(--backdrop-blur-strong)',
                        border: '1px solid var(--glass-border-bright)',
                        borderRadius: '24px',
                        boxShadow: 'var(--shadow-glass-hover), var(--shadow-neon-bright)',
                        perspective: '1000px'
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
                        onClick={onCancel}
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
                        {/* Logout Icon */}
                        <motion.div
                            className="flex justify-center mb-6"
                            variants={iconVariants}
                        >
                            <div
                                className="p-4 rounded-full relative"
                                style={{
                                    background: 'var(--glass-white)',
                                    border: '2px solid #f59e0b',
                                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
                                }}
                            >
                                <FiLogOut
                                    className="w-8 h-8"
                                    style={{ color: '#f59e0b' }}
                                />
                                {/* Pulsing glow */}
                                <div
                                    className="absolute inset-0 rounded-full animate-ping"
                                    style={{
                                        background: 'rgba(245, 158, 11, 0.2)',
                                        animationDuration: '2s'
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            className="text-xl font-semibold text-center mb-2"
                            style={{
                                fontFamily: 'var(--font-modern)',
                                color: 'var(--text-primary)'
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Confirm Logout
                        </motion.h2>

                        <motion.p
                            className="text-center mb-6 leading-relaxed"
                            style={{
                                fontFamily: 'var(--font-clean)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.95rem'
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Please enter your password to confirm logout.
                        </motion.p>

                        {/* Password Input */}
                        <motion.div
                            className="mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="relative">
                                <FiLock
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                    style={{ color: 'var(--text-muted)' }}
                                />
                                <input
                                    type="password"
                                    className="form-input pl-12"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    style={{
                                        background: 'var(--glass-white)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '14px 16px 14px 48px',
                                        color: 'var(--text-primary)',
                                        fontFamily: 'var(--font-clean)',
                                        fontSize: '0.95rem',
                                        width: '100%',
                                        transition: 'var(--transition-smooth)'
                                    }}
                                />
                            </div>
                            {error && (
                                <motion.p
                                    className="text-sm mt-2"
                                    style={{ color: '#ef4444' }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    {error}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            {/* Cancel Button */}
                            <motion.button
                                onClick={onCancel}
                                disabled={loading}
                                className="flex-1 btn-secondary py-3 px-6 font-medium disabled:opacity-50"
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                Cancel
                            </motion.button>

                            {/* Logout Button */}
                            <motion.button
                                onClick={handleLogout}
                                disabled={!password.trim() || loading}
                                className="flex-1 py-3 px-6 font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                                style={{
                                    background: loading || !password.trim()
                                        ? 'var(--glass-slate)'
                                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    border: '1px solid #f59e0b',
                                    color: 'white',
                                    boxShadow: 'var(--shadow-glass), 0 0 20px rgba(245, 158, 11, 0.3)'
                                }}
                                whileHover={{
                                    scale: loading || !password.trim() ? 1 : 1.02,
                                    boxShadow: loading || !password.trim() ? undefined : 'var(--shadow-glass-hover), 0 0 30px rgba(245, 158, 11, 0.5)'
                                }}
                                whileTap={{ scale: loading || !password.trim() ? 1 : 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Logging out...
                                    </>
                                ) : (
                                    <>
                                        <FiLogOut className="w-4 h-4" />
                                        Logout
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LogoutModal;
