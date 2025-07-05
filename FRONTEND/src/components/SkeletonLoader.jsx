import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  width = "100%", 
  height = "20px", 
  className = "",
  variant = "default",
  count = 1,
  spacing = "8px"
}) => {
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
  };

  const skeletonVariants = {
    default: "bg-white/20 backdrop-blur-sm",
    card: "bg-white/10 backdrop-blur-sm rounded-xl",
    text: "bg-white/20 backdrop-blur-sm rounded-md",
    circle: "bg-white/20 backdrop-blur-sm rounded-full",
    button: "bg-white/20 backdrop-blur-sm rounded-xl"
  };

  const Skeleton = ({ index }) => (
    <motion.div
      className={`relative overflow-hidden ${skeletonVariants[variant]} ${className}`}
      style={{ 
        width, 
        height,
        marginBottom: index < count - 1 ? spacing : 0
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2
        }}
      />
    </motion.div>
  );

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} index={index} />
      ))}
    </div>
  );
};

// Predefined skeleton components
export const SkeletonCard = ({ className = "" }) => (
  <div className={`glass rounded-xl p-6 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader variant="circle" width="40px" height="40px" />
      <div className="flex-1">
        <SkeletonLoader variant="text" height="16px" width="60%" className="mb-2" />
        <SkeletonLoader variant="text" height="12px" width="40%" />
      </div>
    </div>
    <SkeletonLoader variant="text" height="14px" count={3} spacing="8px" />
    <div className="flex space-x-2 mt-4">
      <SkeletonLoader variant="button" height="32px" width="80px" />
      <SkeletonLoader variant="button" height="32px" width="80px" />
    </div>
  </div>
);

export const SkeletonList = ({ count = 3, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }, (_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export const SkeletonStats = ({ className = "" }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: 3 }, (_, index) => (
      <div key={index} className="glass rounded-xl p-6">
        <SkeletonLoader variant="circle" width="48px" height="48px" className="mb-4" />
        <SkeletonLoader variant="text" height="24px" width="50%" className="mb-2" />
        <SkeletonLoader variant="text" height="14px" width="70%" />
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
