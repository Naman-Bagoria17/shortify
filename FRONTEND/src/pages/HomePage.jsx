// pages/HomePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { FiLink, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';
import UrlForm from '../components/UrlForm';

const HomePage = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate short URLs in milliseconds"
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Your links are safe and always accessible"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Analytics Ready",
      description: "Track clicks and monitor performance"
    }
  ];

  return (
    <div className="min-h-screen -mt-20 flex flex-col">
      {/* Hero Section */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Hero Content */}
        <div className="text-center mb-12 max-w-4xl">
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-6 float">
              <FiLink className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Shorten URLs
            <span className="block bg-gradient-to-r from-blue-300 to-gray-200 bg-clip-text text-transparent">
              Share Everywhere
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed"
          >
            Transform long, complex URLs into short, shareable links that are perfect for social media,
            emails, and anywhere you need clean, professional links.
          </motion.p>

          {!isAuthenticated && (
            <motion.div variants={itemVariants} className="mb-8">
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-lg text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Get Started Free
                <FiZap className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* URL Form Section */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl mb-16"
        >
          <div className="glass rounded-2xl p-8 animate-slide-up">
            <UrlForm />
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 text-center hover:scale-105 transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl w-full"
        >
          {[
            { number: "10K+", label: "URLs Shortened" },
            { number: "99.9%", label: "Uptime" },
            { number: "1M+", label: "Clicks Tracked" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
