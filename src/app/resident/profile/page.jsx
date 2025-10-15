'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CogIcon,
  BellIcon,
  KeyIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { get, set } from 'idb-keyval';

export default function Profile() {
  const [residentData, setResidentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfileData = async () => {
      const data = await get('resident_data');
      if (data?.data) {
        setResidentData(data.data);
        setEditedData(data.data);
      }
    };

    loadProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedData(residentData);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual update API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local storage
      const updatedResidentData = { ...residentData, ...editedData };
      await set('resident_data', { data: updatedResidentData });

      setResidentData(updatedResidentData);
      setIsEditing(false);

      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Mock image upload - replace with actual upload logic
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        const updatedData = { ...editedData, profileImage: imageUrl };

        setEditedData(updatedData);

        if (!isEditing) {
          setIsEditing(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Mock password change API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);

      alert('Password changed successfully!');
    } catch (error) {
      alert('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!residentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
              <p className="text-sm text-gray-600">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
                    {editedData.profileImage ? (
                      <img
                        src={editedData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-16 h-16 text-emerald-600" />
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg"
                    >
                      <CameraIcon className="w-5 h-5" />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <h3 className="text-xl font-semibold text-gray-800">
                  {editedData.firstName || residentData.firstName} {editedData.lastName || residentData.lastName}
                </h3>
                <p className="text-sm text-gray-600">{editedData.email || residentData.email}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">Verified Resident</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Member Since</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(residentData.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Location</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {editedData.location || residentData.location || 'Not set'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={isLoading}
                      className="w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckIcon className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <KeyIcon className="w-5 h-5" />
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
                <p className="text-sm text-gray-600 mt-1">Update your personal details</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.firstName || ''}
                        onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                        {residentData.firstName || 'Not set'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData.lastName || ''}
                        onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                        {residentData.lastName || 'Not set'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedData.email || ''}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Enter email address"
                      />
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <EnvelopeIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-800">{residentData.email || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedData.phoneNumber || ''}
                        onChange={(e) => setEditedData({ ...editedData, phoneNumber: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <PhoneIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-800">{residentData.phoneNumber || 'Not set'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location/Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.location || ''}
                      onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <MapPinIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-800">{residentData.location || 'Not set'}</span>
                    </div>
                  )}
                </div>

                {/* Bio/About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About/Bio (Optional)
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedData.bio || ''}
                      onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg min-h-[80px]">
                      {residentData.bio || 'No bio added yet'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your account preferences</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BellIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates about your waste collection</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}