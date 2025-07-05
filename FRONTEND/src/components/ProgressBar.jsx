import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  progress = 0, 
  className = "",
  showPercentage = false,
  variant = "default",
  size = "md",
  animated = true
}) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-purple-600",
    success: "bg-gradient-to-r from-green-500 to-emerald-600",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-600",
    danger: "bg-gradient-to-r from-red-500 to-pink-600",
    info: "bg-gradient-to-r from-cyan-500 to-blue-600"
  };

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
    xl: "h-4"
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: { width: `${Math.min(Math.max(progress, 0), 100)}%` }
  };

  return (
    <div className={`relative ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/80">Progress</span>
          <span className="text-sm font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm ${sizes[size]}`}>
        <motion.div
          className={`${sizes[size]} ${variants[variant]} rounded-full relative overflow-hidden`}
          variants={progressVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export const CircularProgress = ({ 
  progress = 0, 
  size = 60, 
  strokeWidth = 4,
  className = "",
  showPercentage = true,
  variant = "default"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const variants = {
    default: "stroke-blue-500",
    success: "stroke-green-500",
    warning: "stroke-yellow-500",
    danger: "stroke-red-500",
    info: "stroke-cyan-500"
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={variants[variant]}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
