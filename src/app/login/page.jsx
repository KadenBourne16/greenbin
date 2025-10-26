'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {set} from 'idb-keyval';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    show: false,
    type: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));

    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9\-\+\(\)\s]+$/.test(formData.phone))
      newErrors.phone = 'Please enter a valid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok){
        setModal({
          show: true,
          type: 'error',
          message: 'Login failed',
        });
        throw new Error('Login failed');
      }
      const data = await response.json();
      if (data.success) {
        // Store token in localStorage
        setModal({
          show: true,
          type: 'success',
          message: 'Login successful! Redirecting...',
        });
        localStorage.setItem('greenbin_access_token', data.token);
        set('resident_data', data);
        // Wait 1.5 seconds to show success message, then redirect
        setTimeout(() => {
          router.push('/resident/dashboard');
        }, 1500);
      }
    } catch {
      setErrors({ submit: 'Invalid phone number or password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-6">
      {modal.show && modal.type === 'social' && <SocialButtonModal modal={modal} setModal={setModal} />}
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
          Welcome Back
        </h1>
        <p className="text-gray-600 mt-2">
          Sign in to your <span className="font-semibold text-emerald-600">GreenBin</span> account
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-xl rounded-2xl py-10 px-7 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {errors.submit}
            </div>
          )}

          {/* Phone Field */}
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="+1 (555) 555-5555"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          {/* Password Field */}
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {/* Remember Me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3.5 font-semibold text-white rounded-lg transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0"
                  />
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Create one
            </Link>
          </p>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center justify-center">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-3 bg-white text-gray-500 text-sm">or continue with</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* Social Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <SocialButton
            label="Google"
            iconPath="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            setModal={() => setModal({show: true, type: 'social'})}
          />
          <SocialButton
            label="Apple"
            iconPath="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"
            setModal={() => setModal({show: true, type: 'social'})}
          />
        </div>
      </div>
    </main>
  );
}

function Input({ label, name, type = 'text', placeholder, value, onChange, error, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function SocialButton({ label, iconPath, setModal }) {
  return (
    <button
      type="button"
      onClick={setModal}
      className="flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-all duration-150 hover:cursor-pointer"
    >
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d={iconPath} />
      </svg>
      {label}
    </button>
  );
}

function SocialButtonModal({ modal, setModal }) {
  const handleClose = () => {
    setModal({ show: false, type: '', message: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Coming Soon</h3>
          <p className="text-sm text-gray-600 mb-6">
            Third-party authentication is currently under development. Please use email/phone login for now.
          </p>
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
