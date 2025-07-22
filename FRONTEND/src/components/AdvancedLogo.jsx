import React from 'react';
import { motion } from 'framer-motion';

const AdvancedLogo = ({ size = 'md', className = '', showText = true, animated = true }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg', icon: 'w-4 h-4' },
    md: { container: 'w-10 h-10', text: 'text-xl', icon: 'w-5 h-5' },
    lg: { container: 'w-12 h-12', text: 'text-2xl', icon: 'w-6 h-6' },
    xl: { container: 'w-16 h-16', text: 'text-3xl', icon: 'w-8 h-8' }
  };

  const currentSize = sizes[size];

  const logoVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      rotateY: -180 
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3
      }
    }
  };

  const textVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      variants={animated ? logoVariants : {}}
      initial={animated ? "initial" : false}
      animate={animated ? "animate" : false}
      whileHover={animated ? "hover" : false}
    >
      {/* Logo Icon Container */}
      <motion.div
        className={`${currentSize.container} relative flex items-center justify-center`}
        style={{ perspective: '1000px' }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue to-neon-blue-bright opacity-20 blur-md"
          variants={animated ? glowVariants : {}}
          animate={animated ? "animate" : false}
        />
        
        {/* Glass Container */}
        <motion.div
          className={`${currentSize.container} glass-neon rounded-xl flex items-center justify-center relative overflow-hidden`}
          style={{
            background: 'var(--glass-white)',
            backdropFilter: 'var(--backdrop-blur)',
            border: '1px solid var(--glass-border-bright)',
            boxShadow: 'var(--shadow-glass), var(--shadow-neon)'
          }}
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent rounded-xl" />
          
          {/* SVG Logo */}
          <motion.svg
            className={currentSize.icon}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            variants={animated ? iconVariants : {}}
          >
            {/* Link Chain Icon with Futuristic Design */}
            <motion.path
              d="M9 12L15 12"
              stroke="var(--neon-blue)"
              strokeWidth="2.5"
              strokeLinecap="round"
              variants={animated ? iconVariants : {}}
            />
            <motion.path
              d="M10.5 7.5C10.5 6.11929 11.6193 5 13 5H16C17.3807 5 18.5 6.11929 18.5 7.5V8.5C18.5 9.88071 17.3807 11 16 11H15"
              stroke="var(--neon-blue-bright)"
              strokeWidth="2.5"
              strokeLinecap="round"
              variants={animated ? iconVariants : {}}
            />
            <motion.path
              d="M13.5 16.5C13.5 17.8807 12.3807 19 11 19H8C6.61929 19 5.5 17.8807 5.5 16.5V15.5C5.5 14.1193 6.61929 13 8 13H9"
              stroke="var(--neon-blue-bright)"
              strokeWidth="2.5"
              strokeLinecap="round"
              variants={animated ? iconVariants : {}}
            />
            
            {/* Futuristic Accent Lines */}
            <motion.circle
              cx="12"
              cy="12"
              r="1"
              fill="var(--neon-blue)"
              variants={animated ? iconVariants : {}}
            />
            <motion.path
              d="M7 7L9 9M17 17L15 15"
              stroke="var(--neon-blue-dim)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
              variants={animated ? iconVariants : {}}
            />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          className="flex flex-col"
          variants={animated ? textVariants : {}}
        >
          <motion.span
            className={`${currentSize.text} font-futuristic font-bold text-primary leading-none`}
            style={{
              fontFamily: 'var(--font-futuristic)',
              color: 'var(--text-primary)',
              textShadow: '0 0 10px var(--neon-glow-soft)'
            }}
          >
            Shortify
          </motion.span>
          <motion.span
            className="text-xs font-clean text-secondary opacity-80 tracking-wider"
            style={{
              fontFamily: 'var(--font-clean)',
              color: 'var(--text-secondary)',
              fontSize: '0.65rem'
            }}
          >
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdvancedLogo;
