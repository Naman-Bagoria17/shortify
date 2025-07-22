import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';
import Portal from './Portal';

const DeleteModal = ({
    title = "Are you sure?",
    message,
    onCancel,
    onConfirm,
    isDeleting = false
}) => {

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
                    onClick={onCancel}
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
                            {/* Warning Icon */}
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
                                        className="w-8 h-8"
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

                            {/* Title */}
                            <motion.h2
                                className="text-xl font-semibold text-center mb-4"
                                style={{
                                    fontFamily: 'var(--font-modern)',
                                    color: 'var(--text-primary)'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {title}
                            </motion.h2>

                            {/* Message */}
                            <motion.p
                                className="text-center mb-8 leading-relaxed"
                                style={{
                                    fontFamily: 'var(--font-clean)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.95rem'
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {message}
                            </motion.p>

                            {/* Action Buttons */}
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {/* Delete Button */}
                                <motion.button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="w-full py-3 px-6 font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
                                    style={{
                                        background: isDeleting
                                            ? 'var(--glass-slate)'
                                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                        border: '1px solid #ef4444',
                                        color: 'white',
                                        boxShadow: 'var(--shadow-glass), 0 0 20px rgba(239, 68, 68, 0.3)'
                                    }}
                                    whileHover={{
                                        scale: isDeleting ? 1 : 1.02,
                                        boxShadow: isDeleting ? undefined : 'var(--shadow-glass-hover), 0 0 30px rgba(239, 68, 68, 0.5)'
                                    }}
                                    whileTap={{ scale: isDeleting ? 1 : 0.98 }}
                                >
                                    {isDeleting ? (
                                        <>
                                            <motion.div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <FiTrash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </motion.button>

                                {/* Cancel Button */}
                                <motion.button
                                    onClick={onCancel}
                                    disabled={isDeleting}
                                    className="w-full btn-secondary py-3 px-6 font-medium disabled:opacity-50"
                                    whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                                    whileTap={{ scale: isDeleting ? 1 : 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </Portal>
    );
};

export default DeleteModal;
