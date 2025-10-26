'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WasteCollector() {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        collectorID: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/collector-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setMessageType('success');
                setMessage(data.message);
                // Store token and redirect
                localStorage.setItem('token', data.token);
                localStorage.setItem('collectorData', JSON.stringify(data.data));

                // Redirect to collector dashboard
                setTimeout(() => {
                    router.push('/waste_collectors/collector');
                }, 1500);
            } else {
                setMessageType('error');
                setMessage(data.message);
            }
        } catch (error) {
            setMessageType('error');
            setMessage('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-green-800 mb-2">Waste Collector Login</h1>
                        <p className="text-gray-600">Sign in to your collector account</p>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            messageType === 'success'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="collectorID" className="block text-sm font-semibold text-gray-700 mb-2">
                                Collector ID
                            </label>
                            <input
                                type="text"
                                id="collectorID"
                                name="collectorID"
                                value={formData.collectorID}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your collector ID"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <a href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                                Contact Administrator
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}