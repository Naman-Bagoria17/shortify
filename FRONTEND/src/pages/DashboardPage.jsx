import React from 'react'
import { motion } from 'framer-motion';
import { FiLink, FiBarChart, FiZap } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getAllUserUrls } from '../api/user.api';
import UrlForm from '../components/UrlForm'
import UserUrl from '../components/UserUrl'

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  // Fetch user URLs to calculate stats
  const { data: urlsData, isLoading, error } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    enabled: !!user,
    retry: 1
  });

  // Ensure urls is always an array - handle different response structures
  const urls = Array.isArray(urlsData)
    ? urlsData
    : Array.isArray(urlsData?.urls)
      ? urlsData.urls
      : [];

  // Calculate stats from user data
  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + (url.clicks || 0), 0);



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

  return (
    <div className="min-h-screen -mt-20 py-20 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4 float">
            <FiLink className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Manage your short URLs, track performance, and create new links with ease.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {[
            {
              icon: <FiLink className="w-6 h-6" />,
              title: "Total Links",
              value: isLoading ? "..." : error ? "0" : totalLinks.toString(),
              color: "from-blue-500 to-gray-400"
            },
            {
              icon: <FiBarChart className="w-6 h-6" />,
              title: "Total Clicks",
              value: isLoading ? "..." : error ? "0" : totalClicks > 999 ? `${(totalClicks / 1000).toFixed(1)}K` : totalClicks.toString(),
              color: "from-gray-500 to-blue-500"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg mb-4 text-white`}>
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/70 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* URL Form Section */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <div className="glass rounded-2xl p-8">
            <UrlForm />
          </div>
        </motion.div>

        {/* User URLs Section */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Links</h2>
            <p className="text-white/70">Manage and track all your shortened URLs</p>
          </div>
          <UserUrl />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default DashboardPage