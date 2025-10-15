'use client';

import { useEffect, useState } from 'react';
import {
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { get } from 'idb-keyval';
import LoadingScreen from '@/app/components/resident/general/loading_screen';

export default function ResidentDashboard() {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    wasteType: 'household',
    pickupDate: '',
    location: '',
    remarks: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);


  //Retrieve all data concerning the resident
  useEffect(() => {
    setLoading(true);
    const getResidentData = async () => {
      const resident_data = await get('resident_data');
      if (!resident_data?.data?._id) {
        console.error('No resident data found');
        return;
      }
      const resident_id = resident_data.data._id;
      const response = await fetch(`/api/resident/dashboard/get_all_data?resident_id=${resident_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to fetch resident data:', response.statusText);
        return;
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      //calculate pending requests
      const pendingRequests = data.wasteRequests.filter(req => req.status === 'pending');
      console.log('Pending requests:', pendingRequests);

      // Update state with fetched data
      if (data.wasteRequests) {
        setPickupRequests(data.wasteRequests.map(req => ({
          id: req._id,
          wasteType: req.wasteType || 'household',
          pickupDate: req.pickupDate || '',
          location: req.location || 'N/A',
          remarks: req.remarks || '',
          status: req.status || 'pending',
          requestID: req.requestID || '',
          requestTimestamp: req.requestTimestamp || ''
        })));
      }
      setLoading(false);
    };

    getResidentData();
  }, [])

  if(loading) {
    return <LoadingScreen />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newRequest.wasteType || !newRequest.pickupDate || !newRequest.location) {
      alert('Please fill in all required fields');
      return;
    }

    // Get resident data for the residentId
    get('resident_data').then(residentData => {
      if (!residentData?.data?._id) {
        alert('Resident data not found. Please log in again.');
        return;
      }

      const submitData = {
        wasteType: newRequest.wasteType,
        pickupDate: newRequest.pickupDate,
        location: newRequest.location,
        remarks: newRequest.remarks,
        residentId: residentData.data._id
      };

      // Submit to API
      fetch('/api/resident/dashboard/post_waste_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Reset form and close modal
          setNewRequest({
            wasteType: 'household',
            pickupDate: '',
            location: '',
            remarks: ''
          });
          setShowRequestModal(false);
          setSuccessMessage('Your pickup request has been submitted successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);

          // Refresh the dashboard data
          window.location.reload(); // Simple refresh for now
        } else {
          alert('Error: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Error submitting request:', error);
        alert('Failed to submit request. Please try again.');
      });
    });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <TruckIcon className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
              GreenBin Resident Dashboard
            </h1>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform"
          >
            <PlusIcon className="w-5 h-5" />
            Request Pickup
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 space-y-8">
        {/* Success Alert */}
        {successMessage && (
          <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 flex items-center text-emerald-700">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-emerald-600" />
            {successMessage}
          </div>
        )}

        {/* Overview Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Total Pickups" value={pickupRequests.length} icon={<TruckIcon />} />
          <StatCard
            title="Pending Requests"
            value={pickupRequests.filter((r) => r.status === 'pending').length}
            icon={<ClockIcon />}
          />
          <StatCard
            title="Completed Pickups"
            value={pickupRequests.filter((r) => r.status === 'completed').length}
            icon={<CheckCircleIcon />}
          />
        </section>

        {/* Pickup History */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pickup History</h2>
          <div className="overflow-x-auto bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-emerald-50/70">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Waste Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pickupRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 transition cursor-pointer relative"
                    onMouseEnter={() => setHoveredRow(req.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">{req.wasteType}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{req.pickupDate ? new Date(req.pickupDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{req.pickupDate ? new Date(req.pickupDate).toLocaleTimeString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-emerald-600" />
                      {req.location}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    {hoveredRow === req.id && (
                      <td className="px-6 py-4 absolute right-4 top-1/2 transform -translate-y-1/2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(req);
                          }}
                          className="bg-emerald-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Request Dustbin Pickup</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={newRequest.wasteType}
                  onChange={(e) => setNewRequest({ ...newRequest, wasteType: e.target.value })}
                >
                  <option value="household">Household</option>
                  <option value="recyclable">Recyclable</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={newRequest.pickupDate}
                  onChange={(e) => setNewRequest({ ...newRequest, pickupDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={newRequest.location}
                  onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
                <textarea
                  placeholder="Any special instructions or notes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  rows="3"
                  value={newRequest.remarks}
                  onChange={(e) => setNewRequest({ ...newRequest, remarks: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm" onClick={handleCloseDetailsModal}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative overflow-y-auto h-[calc(100vh-4rem)]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleCloseDetailsModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Waste Request Details</h3>
            <div className="mt-3 border rounded-lg overflow-hidden shadow-sm h-64">
                  <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254936.9394494253!2d-0.2661017242186902!3d5.594388035731884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1682956315018!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
            </div>
            <h1 className="mt-4 rounded-sm text-center text-gray-500 py-2 text-sm border-2 border-red-600 bg-red-600 text-white">Sorry, could not load map resources</h1>
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <TruckIcon className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Waste Type</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedRequest.wasteType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Date & Time</p>
                  <p className="text-sm text-gray-600">
                    {selectedRequest.pickupDate ? new Date(selectedRequest.pickupDate).toLocaleDateString() : 'N/A'} at{' '}
                    {selectedRequest.pickupDate ? new Date(selectedRequest.pickupDate).toLocaleTimeString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPinIcon className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-sm text-gray-600">{selectedRequest.location}</p>
                </div>
              </div>

              {selectedRequest.remarks && (
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Remarks</p>
                    <p className="text-sm text-gray-600">{selectedRequest.remarks}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <StatusBadge status={selectedRequest.status} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-sm text-gray-600 capitalize">{selectedRequest.status}</p>
                </div>
              </div>

              {selectedRequest.requestID && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Request ID</p>
                  <p className="text-sm text-gray-600 font-mono">{selectedRequest.requestID}</p>
                </div>
              )}

              {selectedRequest.requestTimestamp && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Requested On</p>
                  <p className="text-sm text-gray-600">{new Date(selectedRequest.requestTimestamp).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleCloseDetailsModal}
                className="w-full bg-gray-100 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button className='w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700 transition-colors mt-2'>
                  Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-emerald-100 rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-600 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-emerald-700">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
    inProgress: 'bg-blue-100 text-blue-700',
  }[status] || 'bg-gray-100 text-gray-600';

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${colors}`}
    >
      {status}
    </span>
  );
}
