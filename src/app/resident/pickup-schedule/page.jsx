'use client';

import { useEffect, useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { get } from 'idb-keyval';

export default function PickupSchedule() {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    wasteType: 'household',
    pickupDate: '',
    location: '',
    remarks: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  const fetchPickupRequests = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Error fetching pickup requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRequest.wasteType || !newRequest.pickupDate || !newRequest.location) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const residentData = await get('resident_data');
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

      const response = await fetch('/api/resident/dashboard/post_waste_request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        setNewRequest({
          wasteType: 'household',
          pickupDate: '',
          location: '',
          remarks: ''
        });
        setShowRequestModal(false);
        setSuccessMessage('Your pickup request has been submitted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchPickupRequests(); // Refresh the list
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  const getRequestsForDate = (date) => {
    return pickupRequests.filter(req => {
      if (!req.pickupDate) return false;
      const requestDate = new Date(req.pickupDate);
      return requestDate.toDateString() === date.toDateString();
    });
  };

  const getUpcomingRequests = () => {
    const today = new Date();
    return pickupRequests
      .filter(req => req.status === 'pending' && new Date(req.pickupDate) >= today)
      .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'inProgress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pickup schedule...</p>
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
            <TruckIcon className="w-7 h-7 text-emerald-600" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
              Pickup Schedule
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-2 rounded-l-lg text-sm font-medium transition-colors ${
                  view === 'calendar' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <CalendarIcon className="w-4 h-4 mr-1 inline" />
                Calendar
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 rounded-r-lg text-sm font-medium transition-colors ${
                  view === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ClockIcon className="w-4 h-4 mr-1 inline" />
                List
              </button>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform"
            >
              <PlusIcon className="w-5 h-5" />
              New Request
            </button>
          </div>
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

        {view === 'calendar' ? (
          /* Calendar View */
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-xl shadow-md border border-emerald-100 overflow-hidden">
              {/* Days of week header */}
              <div className="grid grid-cols-7 bg-emerald-50 border-b border-emerald-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {getDaysInMonth(selectedDate).map((day, index) => {
                  const dayRequests = day ? getRequestsForDate(day) : [];
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  const isSelected = day && day.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border-r border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        isToday ? 'bg-emerald-50 border-emerald-200' : ''
                      } ${isSelected ? 'bg-emerald-100' : ''}`}
                      onClick={() => day && setSelectedDate(day)}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-emerald-700' : 'text-gray-700'}`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayRequests.slice(0, 2).map(request => (
                              <div
                                key={request.id}
                                className={`text-xs p-1 rounded ${getStatusColor(request.status)}`}
                              >
                                {request.wasteType}
                              </div>
                            ))}
                            {dayRequests.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayRequests.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Pickups for {selectedDate.toLocaleDateString()}
                </h3>
                {getRequestsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-3">
                    {getRequestsForDate(selectedDate).map(request => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(request.status).replace('bg-', 'bg-').replace('text-', 'text-')}`}></div>
                          <div>
                            <p className="font-medium text-gray-800 capitalize">{request.wasteType} Waste</p>
                            <p className="text-sm text-gray-600">{request.location}</p>
                            {request.remarks && <p className="text-sm text-gray-500 mt-1">{request.remarks}</p>}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(request.pickupDate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No pickups scheduled for this date</p>
                )}
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {/* Upcoming Requests */}
            <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Pickups</h3>
              {getUpcomingRequests().length > 0 ? (
                <div className="space-y-3">
                  {getUpcomingRequests().map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(request.status).replace('bg-', 'bg-').replace('text-', 'text-')}`}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800 capitalize">{request.wasteType} Waste</p>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(request.pickupDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {new Date(request.pickupDate).toLocaleTimeString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {request.location}
                            </span>
                          </div>
                          {request.remarks && (
                            <p className="text-sm text-gray-500 mt-2 italic">Note: {request.remarks}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No upcoming pickups scheduled</p>
              )}
            </div>

            {/* All Requests */}
            <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">All Pickup Requests</h3>
              {pickupRequests.length > 0 ? (
                <div className="space-y-3">
                  {pickupRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(request.status).replace('bg-', 'bg-').replace('text-', 'text-')}`}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800 capitalize">{request.wasteType} Waste</p>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {new Date(request.pickupDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {new Date(request.pickupDate).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            {request.location}
                          </p>
                          {request.remarks && (
                            <p className="text-sm text-gray-500 mt-1 italic">Note: {request.remarks}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {request.requestID}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pickup requests yet</h3>
                  <p className="text-gray-500 mb-6">Schedule your first waste pickup request</p>
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Schedule Pickup
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Schedule Waste Pickup</h3>
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
                  Schedule Pickup
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}