import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLoader, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { loginUser } from '../api/user.api.js';
import { useDispatch } from 'react-redux'
import { useNavigate } from '@tanstack/react-router';
import { login } from '../store/slices/authSlice.js';

const LoginForm = ({ state }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await loginUser(email, password);
            dispatch(login(data.user))
            navigate({ to: "/dashboard" })
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 p-4 bg-rose-400/20 backdrop-blur-sm border border-rose-300/30 rounded-xl text-rose-100"
                >
                    <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                </motion.div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 bg-white/90 backdrop-blur-sm border-2 border-transparent rounded-xl focus:border-blue-400 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <FiEyeOff className="h-5 w-5" />
                            ) : (
                                <FiEye className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <motion.button
                type="submit"
                disabled={loading || !email || !password}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${loading || !email || !password
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn-gradient hover:shadow-xl'
                    }`}
            >
                {loading ? (
                    <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        <span>Signing in...</span>
                    </>
                ) : (
                    <span>Sign In</span>
                )}
            </motion.button>

            <div className="text-center">
                <p className="text-white/80 text-sm">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={() => state(false)}
                        className="text-blue-300 hover:text-gray-200 font-medium transition-colors"
                    >
                        Sign up here
                    </button>
                </p>
            </div>
        </form>
    );
};

export default LoginForm;
