import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { logout } from '../store/slices/authSlice';
import { logoutUser } from '../api/user.api';
import LogoutModal from './LogoutModel.jsx';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'glass shadow-lg'
          : 'bg-white/10 backdrop-blur-sm'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="flex items-center space-x-2 text-white font-bold text-xl hover:text-blue-300 transition-colors duration-300"
              >
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <FiLink className="w-5 h-5" />
                </div>
                <span className="hidden sm:block">Shortify</span>
              </Link>
            </motion.div>

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
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-4">
                {isAuthenticated && (
                  <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium">
                      Hi, {user?.name ?? 'User'}
                    </span>
                  </div>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-rose-400/80 text-white rounded-lg font-medium hover:bg-rose-500 transition-colors duration-300"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    className="block w-full text-center btn-gradient px-4 py-3 text-white rounded-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {showModal && (
          <LogoutModal
            onConfirm={handleLogout}
            onCancel={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
