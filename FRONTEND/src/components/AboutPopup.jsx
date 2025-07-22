import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiShield, FiTrendingUp, FiUsers, FiGlobe, FiStar, FiX } from 'react-icons/fi';

const AboutPopup = ({ isVisible, onClose, onMouseEnter, onMouseLeave }) => {
  const features = [
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Generate short URLs instantly with our optimized infrastructure"
    },
    {
      icon: FiShield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: FiTrendingUp,
      title: "Analytics Dashboard",
      description: "Track clicks, locations, and performance metrics in real-time"
    },
    {
      icon: FiUsers,
      title: "Team Collaboration",
      description: "Share and manage URLs with your team members"
    },
    {
      icon: FiGlobe,
      title: "Global CDN",
      description: "Worldwide content delivery for fastest redirect speeds"
    },
    {
      icon: FiStar,
      title: "Premium Features",
      description: "Custom domains, branded links, and advanced analytics"
    }
  ];

  const containerVariants = {
    hidden: {
      x: -400,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      x: -50,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* About Panel */}
          <motion.div
            className="about-popup-panel fixed left-0 top-0 h-full w-96 md:w-96 z-50 overflow-y-auto"
            style={{
              background: 'var(--glass-slate)',
              backdropFilter: 'var(--backdrop-blur-strong)',
              border: '1px solid var(--glass-border-bright)',
              boxShadow: 'var(--shadow-glass-hover), var(--shadow-neon-bright)'
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <div className="about-popup-content p-6 pt-20">
              {/* Header */}
              <motion.div
                className="mb-6 relative"
                variants={itemVariants}
              >
                {/* Mobile Close Button */}
                <button
                  onClick={onClose}
                  className="md:hidden absolute top-0 right-0 p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                  aria-label="Close About"
                >
                  <FiX className="w-5 h-5" />
                </button>

                <h2
                  className="text-2xl font-bold mb-2 pr-10 md:pr-0"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-clean)'
                  }}
                >
                  About Shortify
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-clean)'
                  }}
                >
                  The most advanced URL shortener with powerful analytics,
                  custom branding, and enterprise-grade security features.
                </p>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                className="space-y-4"
                variants={itemVariants}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-clean)'
                  }}
                >
                  Key Features
                </h3>

                {features.map(({ icon: Icon, title, description }, index) => (
                  <motion.div
                    key={title}
                    className="flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-white/5"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'var(--glass-blue)',
                        border: '1px solid var(--neon-blue)'
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: 'var(--neon-blue)' }}
                      />
                    </div>
                    <div>
                      <h4
                        className="font-medium text-sm mb-1"
                        style={{
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-clean)'
                        }}
                      >
                        {title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-clean)'
                        }}
                      >
                        {description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mt-6 pt-6 border-t border-white/10"
                variants={itemVariants}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-clean)'
                  }}
                >
                  Platform Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div
                      className="text-xl font-bold"
                      style={{ color: 'var(--neon-blue)' }}
                    >
                      1M+
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      URLs Shortened
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div
                      className="text-xl font-bold"
                      style={{ color: 'var(--neon-blue)' }}
                    >
                      50K+
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Active Users
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div
                      className="text-xl font-bold"
                      style={{ color: 'var(--neon-blue)' }}
                    >
                      99.9%
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Uptime
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5">
                    <div
                      className="text-xl font-bold"
                      style={{ color: 'var(--neon-blue)' }}
                    >
                      &lt;1ms
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Avg Response
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                className="mt-6 pt-6 border-t border-white/10 text-center"
                variants={itemVariants}
              >
                <p
                  className="text-xs"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-clean)'
                  }}
                >
                  Built with ❤️ for the modern web
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AboutPopup;
