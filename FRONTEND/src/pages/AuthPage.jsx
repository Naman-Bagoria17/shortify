import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiUserPlus } from 'react-icons/fi';
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="flex flex-col items-center justify-center px-4 py-8 min-h-[calc(100vh-64px)]">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        {isLogin ? (
                            <FiUser className="w-8 h-8 text-white" />
                        ) : (
                            <FiUserPlus className="w-8 h-8 text-white" />
                        )}
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Join Shortify'}
                    </h1>
                    <p className="text-white/80">
                        {isLogin
                            ? 'Sign in to manage your short URLs'
                            : 'Create an account to get started'
                        }
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="glass rounded-xl p-1 mb-6">
                    <div className="grid grid-cols-2 gap-1">
                        <motion.button
                            onClick={() => setIsLogin(true)}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 ${isLogin
                                ? 'bg-white text-gray-800 shadow-lg'
                                : 'text-white hover:bg-white/10'
                                }`}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign In
                        </motion.button>
                        <motion.button
                            onClick={() => setIsLogin(false)}
                            className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 ${!isLogin
                                ? 'bg-white text-gray-800 shadow-lg'
                                : 'text-white hover:bg-white/10'
                                }`}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign Up
                        </motion.button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="glass rounded-xl p-8">
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoginForm state={setIsLogin} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RegisterForm state={setIsLogin} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

export default AuthPage
