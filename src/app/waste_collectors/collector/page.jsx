'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
    { name: 'Dashboard', href: '/waste_collectors/collector', icon: '📊' },
    { name: 'Routes', href: '/waste_collectors/collector/routes', icon: '🗺️' },
    { name: 'Pickups', href: '/waste_collectors/collector/pickups', icon: '📦' },
    { name: 'Report', href: '/waste_collectors/collector/report', icon: '📋' },
    { name: 'Settings', href: '/waste_collectors/collector/settings', icon: '⚙️' },
    { name: 'Profile', href: '/waste_collectors/collector/profile', icon: '👤' },
];

export default function CollectorDashboard() {
    const [collector, setCollector] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pickupRequests, setPickupRequests] = useState([]);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [selectedPickupRequest, setSelectedPickupRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submittingReport, setSubmittingReport] = useState(false);
    const [reportSuccess, setReportSuccess] = useState('');
    const router = useRouter();
    useEffect(() => {
        // Check if collector is logged in
        const token = localStorage.getItem('token');
        const collectorData = localStorage.getItem('collectorData');

        if (!token || !collectorData) {
            router.push('/waste_collectors');
            return;
        }

        try {
            const data = JSON.parse(collectorData);
            setCollector(data);
        } catch (error) {
            console.error('Error parsing collector data:', error);
            router.push('/waste_collectors');
        }
    }, [router]);

    // Fetch pickup requests when Pickups tab is active
    useEffect(() => {
        if (activeTab === 'Pickups') {
            fetchPickupRequests();
        }
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('collectorData');
        router.push('/waste_collectors');
    };

    const fetchPickupRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/collector/pickups');
            const data = await response.json();

            if (data.success) {
                setPickupRequests(data.wasteRequests);
            } else {
                console.error('Failed to fetch pickup requests:', data.error);
            }
        } catch (error) {
            console.error('Error fetching pickup requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReports = async () => {
        try {
            const response = await fetch('/api/collector/reports');
            const data = await response.json();

            if (data.success) {
                setReports(data.reports);
            } else {
                console.error('Failed to fetch reports:', data.error);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const handleViewPickupDetails = (request) => {
        setSelectedPickupRequest(request);
        setShowPickupModal(true);
    };

    const handleCloseReportModal = () => {
        setShowReportModal(false);
        setReportForm({
            category: '',
            title: '',
            description: '',
            priority: 'medium',
            location: ''
        });
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();

        if (!reportForm.category || !reportForm.title || !reportForm.description || !reportForm.location) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmittingReport(true);

        try {
            const submitData = {
                ...reportForm,
                collectorId: collector._id
            };

            const response = await fetch('/api/collector/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();

            if (data.success) {
                setReportForm({
                    category: '',
                    title: '',
                    description: '',
                    priority: 'medium',
                    location: ''
                });
                setShowReportModal(false);
                setReportSuccess('Your report has been submitted successfully!');
                setTimeout(() => setReportSuccess(''), 3000);
                fetchReports(); // Refresh the list
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report. Please try again.');
        } finally {
            setSubmittingReport(false);
        }
    };

    const handleUpdatePickupStatus = async (requestId, newStatus) => {
        try {
            const response = await fetch(`/api/collector/pickups/${requestId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();

            if (data.success) {
                // Refresh pickup requests
                fetchPickupRequests();
                handleClosePickupModal();
            } else {
                alert('Error updating status: ' + data.error);
            }
        } catch (error) {
            console.error('Error updating pickup status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleClosePickupModal = () => {
        setShowPickupModal(false);
        setSelectedPickupRequest(null);
    };

    const getContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {collector?.firstName}!</h2>
                            <p className="text-gray-600">Here's your dashboard overview for today.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Stats Cards */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <span className="text-2xl">📦</span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Today's Pickups</h3>
                                        <p className="text-2xl font-bold text-green-600">12</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <span className="text-2xl">🗺️</span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Active Route</h3>
                                        <p className="text-lg font-bold text-blue-600">{collector?.assignedRoute || 'Not assigned'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <span className="text-2xl">🚛</span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Vehicle</h3>
                                        <p className="text-lg font-bold text-yellow-600">{collector?.vehicleNumber || 'Not assigned'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
                                        <p className="text-2xl font-bold text-purple-600">8</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <span className="text-2xl">⏳</span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Pending</h3>
                                        <p className="text-2xl font-bold text-red-600">4</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Status</h3>
                                        <p className="text-lg font-bold text-indigo-600 capitalize">{collector?.status || 'offline'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <span className="text-green-500 mr-3">✓</span>
                                                <span className="text-gray-800">Completed pickup at Green Street, Block 5</span>
                                            </div>
                                            <span className="text-sm text-gray-500">2 hours ago</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <span className="text-blue-500 mr-3">🔄</span>
                                                <span className="text-gray-800">Started route: Downtown Sector A</span>
                                            </div>
                                            <span className="text-sm text-gray-500">4 hours ago</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 mr-3">⚠️</span>
                                                <span className="text-gray-800">Vehicle maintenance reminder</span>
                                            </div>
                                            <span className="text-sm text-gray-500">1 day ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Pickups':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pickup Requests</h2>
                            <p className="text-gray-600">Manage and track all waste pickup requests</p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                <span className="ml-2 text-gray-600">Loading pickup requests...</span>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pickupRequests.map((request) => (
                                                <tr key={request.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{request.requestID}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {request.resident?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                                            {request.wasteType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {request.pickupDate ? new Date(request.pickupDate).toLocaleDateString() : 'N/A'}
                                                        <br />
                                                        <span className="text-gray-500 text-xs">
                                                            {request.pickupDate ? new Date(request.pickupDate).toLocaleTimeString() : ''}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={request.location}>
                                                        {request.location}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            request.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                                                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        } capitalize`}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleViewPickupDetails(request)}
                                                            className="text-green-600 hover:text-green-900 mr-3"
                                                        >
                                                            View Details
                                                        </button>
                                                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                            Update Status
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {pickupRequests.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-4xl mb-4">📦</div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pickup requests</h3>
                                        <p className="text-gray-500">There are no pickup requests at the moment.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            case 'Profile':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h2>
                            <p className="text-gray-600">View and manage your account information</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl text-green-600 font-semibold">
                                        {collector?.firstName?.charAt(0)}{collector?.lastName?.charAt(0)}
                                    </span>
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {collector?.firstName} {collector?.lastName}
                                    </h3>
                                    <p className="text-gray-600">Waste Collector</p>
                                    <p className="text-sm text-gray-500">ID: {collector?.collectorID}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{collector?.email || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{collector?.phone || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            collector?.status === 'active' ? 'bg-green-100 text-green-800' :
                                            collector?.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        } capitalize`}>
                                            {collector?.status || 'offline'}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Route</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{collector?.assignedRoute || 'Not assigned'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{collector?.vehicleNumber || 'Not assigned'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                                            {collector?.createdAt ? new Date(collector.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Pickups</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">156</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">⭐ 4.8/5.0</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">Account Actions</h4>
                                        <p className="text-sm text-gray-600">Manage your account settings</p>
                                    </div>
                                    <div className="space-x-3">
                                        <button className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50">
                                            Edit Profile
                                        </button>
                                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Report':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Issues</h2>
                            <p className="text-gray-600">Submit reports about issues, problems, or concerns</p>
                        </div>

                        {/* Success Alert */}
                        {reportSuccess && (
                            <div className="mb-6 rounded-md bg-emerald-50 border border-emerald-200 p-4 flex items-center text-emerald-700">
                                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {reportSuccess}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Report Form */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Submit New Report</h3>
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                                    >
                                        Open Form
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-xl mr-3">🚛</span>
                                                <div>
                                                    <p className="font-medium text-gray-800">Vehicle Maintenance</p>
                                                    <p className="text-sm text-gray-600">Report vehicle issues or maintenance needs</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-xl mr-3">🗺️</span>
                                                <div>
                                                    <p className="font-medium text-gray-800">Route Issues</p>
                                                    <p className="text-sm text-gray-600">Report problems with collection routes</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-xl mr-3">⚠️</span>
                                                <div>
                                                    <p className="font-medium text-gray-800">Safety Concerns</p>
                                                    <p className="text-sm text-gray-600">Report safety-related issues</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-xl mr-3">📦</span>
                                                <div>
                                                    <p className="font-medium text-gray-800">Pickup Problems</p>
                                                    <p className="text-sm text-gray-600">Issues with waste pickup process</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Submit New Report
                                    </button>
                                </div>
                            </div>

                            {/* Recent Reports */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reports</h3>
                                <div className="space-y-3">
                                    {reports.length > 0 ? reports.slice(0, 3).map(report => (
                                        <div key={report._id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{report.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{report.description.substring(0, 100)}...</p>
                                                    <div className="flex items-center mt-2 space-x-2">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            report.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                                            report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                            report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {report.priority}
                                                        </span>
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                            report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                            report.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {report.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    {new Date(report.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-2">📋</div>
                                            <p className="text-gray-500">No reports submitted yet</p>
                                        </div>
                                    )}
                                </div>

                                {reports.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <button className="w-full text-green-600 hover:text-green-800 font-medium">
                                            View All Reports
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Report Modal */}
                        {showReportModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800">Submit Report</h3>
                                            <button
                                                onClick={handleCloseReportModal}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <form onSubmit={handleReportSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Report Category *</label>
                                                <select
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                    value={reportForm.category}
                                                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select a category</option>
                                                    <option value="vehicle_maintenance">Vehicle Maintenance</option>
                                                    <option value="route_issue">Route Issue</option>
                                                    <option value="pickup_problem">Pickup Problem</option>
                                                    <option value="safety_concern">Safety Concern</option>
                                                    <option value="customer_complaint">Customer Complaint</option>
                                                    <option value="equipment_failure">Equipment Failure</option>
                                                    <option value="weather_delay">Weather Delay</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Brief description of the issue"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                    value={reportForm.title}
                                                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                                <select
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                    value={reportForm.priority}
                                                    onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value })}
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                    <option value="urgent">Urgent</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Where did this issue occur?"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                    value={reportForm.location}
                                                    onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                                <textarea
                                                    rows="4"
                                                    placeholder="Provide detailed information about the issue"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                    value={reportForm.description}
                                                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleCloseReportModal}
                                                    className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={submittingReport}
                                                    className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {submittingReport ? 'Submitting...' : 'Submit Report'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Routes':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">My Routes</h2>
                            <p className="text-gray-600">Manage your assigned collection routes and schedule</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Current Route */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <span className="text-2xl">🗺️</span>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Current Route</h3>
                                        <p className="text-sm text-gray-600">Active collection route</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                                        <p className="text-lg font-bold text-blue-600">{collector?.assignedRoute || 'Not assigned'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Route Status</label>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            collector?.status === 'active' ? 'bg-green-100 text-green-800' :
                                            collector?.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        } capitalize`}>
                                            {collector?.status || 'offline'}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{collector?.vehicleNumber || 'Not assigned'}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Today's Progress</label>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">13 of 20 pickups completed</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                            Start Route
                                        </button>
                                        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                            View Map
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Route Statistics */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Statistics</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">📦</span>
                                            <div>
                                                <p className="font-medium text-gray-800">Total Pickups</p>
                                                <p className="text-sm text-gray-600">This month</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-green-600">247</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">⏱️</span>
                                            <div>
                                                <p className="font-medium text-gray-800">Avg. Completion</p>
                                                <p className="text-sm text-gray-600">Per route</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-blue-600">4.2h</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">⭐</span>
                                            <div>
                                                <p className="font-medium text-gray-800">Performance</p>
                                                <p className="text-sm text-gray-600">This month</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-yellow-600">4.8/5</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">🚛</span>
                                            <div>
                                                <p className="font-medium text-gray-800">Distance</p>
                                                <p className="text-sm text-gray-600">This week</p>
                                            </div>
                                        </div>
                                        <span className="text-xl font-bold text-purple-600">156km</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Routes */}
                        <div className="mt-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Routes</h3>
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickups</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Downtown Sector A</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Today</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">13/20</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3.5h</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        In Progress
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Residential Block B</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yesterday</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18/18</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.2h</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Commercial District C</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 days ago</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/16</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5.1h</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Partial
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Settings':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
                            <p className="text-gray-600">Manage your account preferences and notifications</p>
                        </div>

                        <div className="space-y-6">
                            {/* Account Settings */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Email Notifications</h4>
                                            <p className="text-sm text-gray-600">Receive updates about route changes and pickups</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                                            <p className="text-sm text-gray-600">Get text alerts for urgent route updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Location Tracking</h4>
                                            <p className="text-sm text-gray-600">Allow GPS tracking during routes</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Auto Route Optimization</h4>
                                            <p className="text-sm text-gray-600">Automatically optimize pickup order for efficiency</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Settings */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            defaultValue={collector?.vehicleNumber || ''}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                                            <option>Truck - 2 Ton</option>
                                            <option>Truck - 5 Ton</option>
                                            <option>Van - Small</option>
                                            <option>Van - Large</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            placeholder="Enter license plate"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                        <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none">
                                            <option>Diesel</option>
                                            <option>Petrol</option>
                                            <option>Electric</option>
                                            <option>Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy Settings */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy & Security</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                                        </div>
                                        <button className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                            Enable
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Change Password</h4>
                                            <p className="text-sm text-gray-600">Update your account password</p>
                                        </div>
                                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            Change
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-800">Download Data</h4>
                                            <p className="text-sm text-gray-600">Export your account and activity data</p>
                                        </div>
                                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="p-6">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🚧</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeTab} Coming Soon</h2>
                            <p className="text-gray-600">This section is under development.</p>
                        </div>
                    </div>
                );
        }
    };

    if (!collector) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo/Brand */}
                    <div className="flex items-center justify-center h-16 px-4 bg-green-600 text-white">
                        <h1 className="text-xl font-bold">GreenBin</h1>
                    </div>

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-semibold">
                                    {collector?.firstName?.charAt(0)}{collector?.lastName?.charAt(0)}
                                </span>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-semibold text-gray-800">
                                    {collector?.firstName} {collector?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">ID: {collector?.collectorID}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => {
                                    setActiveTab(item.name);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                                    activeTab === item.name
                                        ? 'bg-green-100 text-green-800 border-r-4 border-green-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="text-xl mr-3">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                            <span className="text-xl mr-3">🚪</span>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="ml-4 lg:ml-0">
                                <h1 className="text-xl font-semibold text-gray-900">{activeTab}</h1>
                                <p className="text-sm text-gray-500">Waste Collection Management</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center text-sm text-gray-700">
                                <span className="font-medium">{collector?.firstName} {collector?.lastName}</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{collector?.status || 'offline'}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="hidden md:flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                                <span className="mr-2">🚪</span>
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto">
                    {getContent()}
                </main>
            </div>

            {/* Pickup Request Details Modal */}
            {showPickupModal && selectedPickupRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Pickup Request Details</h2>
                                <button
                                    onClick={handleClosePickupModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Map placeholder */}
                            <div className="mb-6">
                                <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">🗺️</div>
                                        <p className="text-gray-600">Interactive Map</p>
                                        <p className="text-sm text-gray-500 mt-1">Location: {selectedPickupRequest.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
                                        <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">{selectedPickupRequest.requestID}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                                        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                            {selectedPickupRequest.wasteType}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                            selectedPickupRequest.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            selectedPickupRequest.status === 'inProgress' ? 'bg-blue-100 text-blue-800' :
                                            selectedPickupRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        } capitalize`}>
                                            {selectedPickupRequest.status}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                                        <p className="text-sm text-gray-900">
                                            {selectedPickupRequest.requestTimestamp ?
                                                new Date(selectedPickupRequest.requestTimestamp).toLocaleDateString() + ' at ' +
                                                new Date(selectedPickupRequest.requestTimestamp).toLocaleTimeString()
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Resident</label>
                                        <p className="text-sm text-gray-900">{selectedPickupRequest.resident?.name || 'N/A'}</p>
                                        {selectedPickupRequest.resident?.email && (
                                            <p className="text-sm text-gray-600">{selectedPickupRequest.resident.email}</p>
                                        )}
                                        {selectedPickupRequest.resident?.phone && (
                                            <p className="text-sm text-gray-600">{selectedPickupRequest.resident.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date & Time</label>
                                        <p className="text-sm text-gray-900">
                                            {selectedPickupRequest.pickupDate ?
                                                new Date(selectedPickupRequest.pickupDate).toLocaleDateString() + ' at ' +
                                                new Date(selectedPickupRequest.pickupDate).toLocaleTimeString()
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <p className="text-sm text-gray-900">{selectedPickupRequest.location}</p>
                                    </div>

                                    {selectedPickupRequest.collector && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Collector</label>
                                            <p className="text-sm text-gray-900">
                                                {selectedPickupRequest.collector.name} (ID: {selectedPickupRequest.collector.collectorID})
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedPickupRequest.remarks && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedPickupRequest.remarks}</p>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    onClick={handleClosePickupModal}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Close
                                </button>
                                <div className="flex space-x-2">
                                    {selectedPickupRequest.status !== 'completed' && (
                                        <button
                                            onClick={() => handleUpdatePickupStatus(selectedPickupRequest.id, 'completed')}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                    {selectedPickupRequest.status === 'pending' && (
                                        <button
                                            onClick={() => handleUpdatePickupStatus(selectedPickupRequest.id, 'inProgress')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Start Pickup
                                        </button>
                                    )}
                                    {selectedPickupRequest.status !== 'cancelled' && (
                                        <button
                                            onClick={() => handleUpdatePickupStatus(selectedPickupRequest.id, 'cancelled')}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}