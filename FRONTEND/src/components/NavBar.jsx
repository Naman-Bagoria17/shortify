import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink, FiUser, FiLogOut, FiMenu, FiX, FiInfo } from 'react-icons/fi';
import { logout } from '../store/slices/authSlice';
import { logoutUser } from '../api/user.api';
import LogoutModal from './LogoutModel.jsx';
import AdvancedLogo from './AdvancedLogo.jsx';
import AboutPopup from './AboutPopup.jsx';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [aboutHoverTimeout, setAboutHoverTimeout] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async (enteredPassword) => {
    try {
      await logoutUser(enteredPassword);
      dispatch(logout());
      navigate({ to: '/' });
      setShowModal(false); // ✅ only close on success
    } catch (err) {
      throw err; // ❌ do not close modal, let modal handle error
    }
  };

  // Handle about popup hover with delay
  const handleAboutHover = () => {
    if (aboutHoverTimeout) {
      clearTimeout(aboutHoverTimeout);
      setAboutHoverTimeout(null);
    }
    setShowAboutPopup(true);
  };

  const handleAboutLeave = () => {
    const timeout = setTimeout(() => {
      setShowAboutPopup(false);
    }, 200); // Short delay to allow moving to popup
    setAboutHoverTimeout(timeout);
  };

  const handleAboutPopupHover = () => {
    if (aboutHoverTimeout) {
      clearTimeout(aboutHoverTimeout);
      setAboutHoverTimeout(null);
    }
  };

  const handleAboutPopupLeave = () => {
    setShowAboutPopup(false);
  };

  // Handle mobile about popup toggle
  const handleMobileAboutToggle = () => {
    setShowAboutPopup(!showAboutPopup);
  };

  return (
    <>
      <div
        className="navbar-fixed-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          width: '100%',
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <nav className="w-full"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Advanced Logo with About Popup */}
              <div className="flex items-center space-x-2">
                <div
                  className="relative"
                  onMouseEnter={handleAboutHover}
                  onMouseLeave={handleAboutLeave}
                >
                  <Link to="/" className="flex items-center">
                    <AdvancedLogo
                      size="md"
                      showText={true}
                      animated={true}
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </div>

                {/* Mobile About Info Button */}
                <motion.button
                  onClick={handleMobileAboutToggle}
                  className="md:hidden p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  title="About Shortify"
                >
                  <FiInfo className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-gray-400 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">
                      Hi, {user?.name ?? 'User'}
                    </span>
                  </motion.div>
                )}

                {isAuthenticated ? (
                  <motion.button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 px-6 py-2 bg-rose-400/80 hover:bg-rose-500 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </motion.button>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/auth"
                      className="btn-gradient px-6 py-2 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {isMobileMenuOpen ? (
                      <FiX className="w-6 h-6" />
                    ) : (
                      <FiMenu className="w-6 h-6" />
                    )}
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                  y: 0,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                    staggerChildren: 0.1
                  }
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -20,
                  transition: {
                    duration: 0.2,
                    ease: "easeIn"
                  }
                }}
                className="md:hidden glass border-t border-white/20"
              >
                <motion.div
                  className="px-4 py-4 space-y-4"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {isAuthenticated && (
                    <motion.div
                      className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-medium">
                        Hi, {user?.name ?? 'User'}
                      </span>
                    </motion.div>
                  )}

                  {isAuthenticated ? (
                    <motion.button
                      onClick={() => {
                        setShowModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-rose-400/80 text-white rounded-lg font-medium hover:bg-rose-500 transition-colors duration-300"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.3, ease: "easeOut" }
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            duration: 0.4,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/auth"
                        className="block w-full text-center btn-gradient px-4 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      <AnimatePresence>
        {showModal && (
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>

      {/* About Popup */}
      <AboutPopup
        isVisible={showAboutPopup}
        onClose={handleAboutPopupLeave}
        onMouseEnter={handleAboutPopupHover}
        onMouseLeave={handleAboutPopupLeave}
      />
    </>
  );
};

export default Navbar;
