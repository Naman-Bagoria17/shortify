import React, { useEffect, useState } from 'react';

const LogoutModal = ({ onConfirm, onCancel }) => {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(timeout);
    }, []);

    const handleLogout = async () => {
        if (!password.trim()) {
            setError('Password is required.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await onConfirm(password); // throws if wrong password
        } catch (err) {
            setError(err?.response?.data?.message || 'Logout failed');
        } finally {
            setLoading(false); // keep modal open to show error
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10 transition-opacity duration-300">
            <div
                className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center transform transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
                <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                <p className="mb-4 text-gray-600">Please enter your password to confirm logout.</p>

                <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-red-200 mb-2"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                    }}
                />

                {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 rounded transition text-white ${password ? 'bg-rose-400 hover:bg-rose-500' : 'bg-rose-300 cursor-not-allowed'}`}
                        disabled={!password.trim() || loading}
                        onClick={handleLogout}
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
