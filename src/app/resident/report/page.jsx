'use client';

import { useEffect, useState } from 'react';
import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PaperClipIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { get } from 'idb-keyval';

export default function ReportIssue() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    priority: 'medium',
    location: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const resident_data = await get('resident_data');
      if (!resident_data?.data?._id) {
        console.error('No resident data found');
        return;
      }

      const resident_id = resident_data.data._id;
      const response = await fetch(`/api/resident/reports?resident_id=${resident_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch reports:', response.statusText);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.title || !formData.description || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const residentData = await get('resident_data');
      if (!residentData?.data?._id) {
        alert('Resident data not found. Please log in again.');
        return;
      }

      const submitData = {
        ...formData,
        residentId: residentData.data._id
      };

      const response = await fetch('/api/resident/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({
          category: '',
          title: '',
          description: '',
          priority: 'medium',
          location: ''
        });
        setShowForm(false);
        setSuccessMessage('Your report has been submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchReports(); // Refresh the list
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'responded': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'missed_pickup': return '🚛';
      case 'bin_damage': return '🗑️';
      case 'service_quality': return '⭐';
      case 'billing_issue': return '💰';
      case 'app_technical': return '📱';
      case 'route_complaint': return '🗺️';
      case 'safety_concern': return '⚠️';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
              Report Issue
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform"
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            New Report
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 rounded-md bg-emerald-50 border border-emerald-200 p-4 flex items-center text-emerald-700">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-emerald-600" />
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Submit New Report</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="missed_pickup">Missed Pickup</option>
                    <option value="bin_damage">Bin Damage</option>
                    <option value="service_quality">Service Quality</option>
                    <option value="billing_issue">Billing Issue</option>
                    <option value="app_technical">App Technical Issue</option>
                    <option value="route_complaint">Route Complaint</option>
                    <option value="safety_concern">Safety Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Where did this issue occur?"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide detailed information about the issue"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <PaperClipIcon className="w-4 h-4" />
                    Attach Photo
                  </button>
                  <span className="text-sm text-gray-500">Optional</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 mr-2 inline animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reports List */}
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Your Reports</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  + New Report
                </button>
              )}
            </div>

            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-2xl">{getCategoryIcon(report.category)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
                              {report.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                              {report.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <ClipboardDocumentListIcon className="w-4 h-4" />
                              {report.category.replace('_', ' ')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {report.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {new Date(report.timestamp).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{report.description}</p>

                          {report.response && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <ChatBubbleLeftIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Response</span>
                              </div>
                              <p className="text-sm text-blue-700">{report.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Report ID: {report.reportID}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                <p className="text-gray-500 mb-6">Submit your first report about any issues or concerns</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Submit Report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Report Categories Info */}
        <div className="mt-8 bg-white rounded-xl shadow-md border border-emerald-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🚛</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Missed Pickup</p>
                <p className="text-xs text-gray-600">Scheduled pickup was missed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🗑️</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Bin Damage</p>
                <p className="text-xs text-gray-600">Damaged or broken bins</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">⭐</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Service Quality</p>
                <p className="text-xs text-gray-600">Collector service issues</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">💰</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Billing Issue</p>
                <p className="text-xs text-gray-600">Payment or invoice problems</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">📱</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">App Technical</p>
                <p className="text-xs text-gray-600">App bugs or errors</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">🗺️</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Route Complaint</p>
                <p className="text-xs text-gray-600">Collection route issues</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Safety Concern</p>
                <p className="text-xs text-gray-600">Safety-related issues</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xl">📋</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Other</p>
                <p className="text-xs text-gray-600">Any other issues</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
