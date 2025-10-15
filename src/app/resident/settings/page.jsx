'use client';
import React, { useState, useEffect } from 'react';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  MoonIcon,
  SunIcon,
  TrashIcon,
  KeyIcon,
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { get, set } from 'idb-keyval';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: false,
      pushNotifications: false,
      smsNotifications: false,
      collectionReminders: false,
      promotionalEmails: false,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analyticsTracking: true,
    },
    preferences: {
      theme: 'light',
      language: 'en',
      autoRefresh: false,
      compactView: false,
    }
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const savedSettings = await get('resident_settings');
      if (savedSettings) {
        setSettings({ ...settings, ...savedSettings });
      }
    };

    loadSettings();
  }, []);

  const updateSetting = async (category, key, value) => {
    const updatedSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };

    setSettings(updatedSettings);
    await set('resident_settings', updatedSettings);
  };

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      // Mock data export - replace with actual API call
      const residentData = await get('resident_data');
      const exportData = {
        profile: residentData?.data || {},
        settings,
        exportedAt: new Date().toISOString(),
        appVersion: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `greenbin-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowExportModal(false);
      alert('Data exported successfully!');
    } catch (error) {
      alert('Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // Mock account deletion - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear all local data
      await set('resident_data', null);
      await set('resident_settings', null);

      alert('Account deleted successfully. You will be redirected.');
      // In a real app, redirect to login or home page
      window.location.href = '/';
    } catch (error) {
      alert('Failed to delete account. Please contact support.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const SettingToggle = ({ title, description, checked, onChange, disabled = false }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg ${disabled ? 'bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
      <div className="flex-1">
        <p className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-800'}`}>
          {title}
        </p>
        <p className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
      <label className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50' : ''}`}>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${checked ? 'peer-checked:bg-emerald-600' : ''}`}></div>
      </label>
    </div>
  );

  const SettingSelect = ({ title, description, value, options, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <CogIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-sm text-gray-600">Customize your GreenBin experience</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  <p className="text-sm text-gray-600">Manage how you receive updates</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <SettingToggle
                title="Email Notifications"
                description="Receive email updates about your waste collection requests"
                checked={settings.notifications.emailNotifications}
                onChange={(value) => updateSetting('notifications', 'emailNotifications', value)}
              />

              <SettingToggle
                title="Push Notifications"
                description="Get push notifications on your device"
                checked={settings.notifications.pushNotifications}
                onChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
              />

              <SettingToggle
                title="SMS Notifications"
                description="Receive text messages for urgent updates"
                checked={settings.notifications.smsNotifications}
                onChange={(value) => updateSetting('notifications', 'smsNotifications', value)}
              />

              <SettingToggle
                title="Collection Reminders"
                description="Get reminded about upcoming waste collections"
                checked={settings.notifications.collectionReminders}
                onChange={(value) => updateSetting('notifications', 'collectionReminders', value)}
              />

              <SettingToggle
                title="Promotional Emails"
                description="Receive updates about new features and promotions"
                checked={settings.notifications.promotionalEmails}
                onChange={(value) => updateSetting('notifications', 'promotionalEmails', value)}
              />
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Privacy & Security</h3>
                  <p className="text-sm text-gray-600">Control your data and security settings</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <SettingSelect
                title="Profile Visibility"
                description="Who can see your profile information"
                value={settings.privacy.profileVisibility}
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'collectors', label: 'Waste Collectors Only' },
                  { value: 'private', label: 'Private' }
                ]}
                onChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
              />

              <SettingToggle
                title="Data Sharing"
                description="Allow anonymous usage data to improve our service"
                checked={settings.privacy.dataSharing}
                onChange={(value) => updateSetting('privacy', 'dataSharing', value)}
              />

              <SettingToggle
                title="Analytics Tracking"
                description="Help us understand how you use GreenBin"
                checked={settings.privacy.analyticsTracking}
                onChange={(value) => updateSetting('privacy', 'analyticsTracking', value)}
              />

              <div className="pt-4 border-t border-gray-200">
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

          {/* App Preferences */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">App Preferences</h3>
                  <p className="text-sm text-gray-600">Customize your app experience</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <SettingSelect
                title="Theme"
                description="Choose your preferred color scheme"
                value={settings.preferences.theme}
                options={[
                  { value: 'light', label: 'Light' },
                ]}
                onChange={(value) => updateSetting('preferences', 'theme', value)}
              />

              <SettingSelect
                title="Language"
                description="Select your preferred language"
                value={settings.preferences.language}
                options={[
                  { value: 'en', label: 'English' },
                ]}
                onChange={(value) => updateSetting('preferences', 'language', value)}
              />

              <SettingToggle
                title="Auto Refresh"
                description="Automatically refresh data in the background"
                checked={settings.preferences.autoRefresh}
                onChange={(value) => updateSetting('preferences', 'autoRefresh', value)}
              />

              <SettingToggle
                title="Compact View"
                description="Use a more compact layout to show more information"
                checked={settings.preferences.compactView}
                onChange={(value) => updateSetting('preferences', 'compactView', value)}
              />
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <InformationCircleIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Data Management</h3>
                  <p className="text-sm text-gray-600">Export or delete your data</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-medium text-blue-800">Export Your Data</p>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Download a copy of all your GreenBin data including profile information, transaction history, and settings.
                </p>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  Export Data
                </button>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <p className="font-medium text-red-800">Danger Zone</p>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            Settings are automatically saved
          </div>
        </div>
      </div>

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">Export Your Data</h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">What will be exported?</p>
                  <p className="text-sm text-blue-700">Profile information, transaction history, and app settings</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExportData}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Exporting...' : 'Export Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">What will be deleted:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Your profile and personal information</li>
                  <li>• All transaction history</li>
                  <li>• Waste collection requests</li>
                  <li>• Wallet balance and payment history</li>
                  <li>• App settings and preferences</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Keep Account
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h3>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}