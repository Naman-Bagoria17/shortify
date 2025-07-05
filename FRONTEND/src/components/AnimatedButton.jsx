import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-opacity-50";

  const variants = {
    primary: "btn-gradient text-white focus:ring-blue-300 shadow-lg hover:shadow-xl",
    secondary: "bg-white/20 text-white hover:bg-white/30 focus:ring-white/30 backdrop-blur-sm",
    danger: "bg-rose-400 text-white hover:bg-rose-500 focus:ring-rose-300 shadow-lg hover:shadow-xl",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-300 shadow-lg hover:shadow-xl",
    ghost: "text-white hover:bg-white/10 focus:ring-white/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  const buttonVariants = {
    hover: {
      scale: disabled || loading ? 1 : 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: disabled || loading ? 1 : 0.98,
      transition: { duration: 0.1 }
    }
  };

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: { scale: 4, opacity: 0 },
  };

  const [ripples, setRipples] = React.useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple Effect */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          variants={rippleVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6 }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="flex items-center space-x-2 relative z-10"
        animate={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {icon && !loading && <span>{icon}</span>}
        <span>{children}</span>
      </motion.div>

      {/* Shine Effect */}
      {!disabled && !loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton;
