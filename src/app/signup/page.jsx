'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Utility for icons (keeps JSX clean)
const Icon = ({ type, className = '' }) => {
  const icons = {
    check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  };
  return icons[type];
};

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    location: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9\-\+\(\)\s]+$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setModal({ show: true, type: 'success', message: data.message });
        setTimeout(() => router.push('/login'), 2500);
      } else {
        setModal({ show: true, type: 'error', message: data.message });
      }
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex flex-col justify-center py-12 px-6">
      {/* Success/Error Modal */}
      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div
            className={`max-w-sm w-full p-6 rounded-2xl shadow-2xl transition-all duration-300 ${
              modal.type === 'success'
                ? 'bg-gradient-to-br from-emerald-50 to-white border border-emerald-200'
                : 'bg-gradient-to-br from-red-50 to-white border border-red-200'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className={`rounded-full p-4 ${
                  modal.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}
              >
                <Icon type={modal.type === 'success' ? 'check' : 'error'} className="w-8 h-8" />
              </div>
              <h3
                className={`text-lg font-semibold ${
                  modal.type === 'success' ? 'text-emerald-800' : 'text-red-800'
                }`}
              >
                {modal.type === 'success' ? 'Success!' : 'Error'}
              </h3>
              <p className="text-gray-700">{modal.message}</p>
              {modal.type === 'error' && (
                <button
                  onClick={() => setModal({ show: false })}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
          GreenBin
        </h1>
        <p className="text-gray-600 mt-2">Join our sustainable community 🌱</p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-xl rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input label="First Name" name="firstName" required error={errors.firstName} value={formData.firstName} onChange={handleChange} />
            <Input label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" required error={errors.lastName} value={formData.lastName} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Date of Birth" type="date" name="dateOfBirth" required error={errors.dateOfBirth} value={formData.dateOfBirth} onChange={handleChange} />
            <Input label="Location" name="location" required error={errors.location} value={formData.location} onChange={handleChange} placeholder="City, Country" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Email" name="email" type="email" required error={errors.email} value={formData.email} onChange={handleChange} placeholder="you@example.com" />
            <Input label="Phone" name="phone" required error={errors.phone} value={formData.phone} onChange={handleChange} placeholder="+1 (555) 555-5555" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Password" name="password" type="password" required error={errors.password} value={formData.password} onChange={handleChange} placeholder="Minimum 8 characters" />
            <Input label="Confirm Password" name="confirmPassword" type="password" required error={errors.confirmPassword} value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-emerald-100">
            <input id="terms" type="checkbox" required className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700 underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit */}
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0" />
                </svg>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Sign in instead
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

// Small reusable input component (cleans up main JSX)
function Input({ label, name, type = 'text', error, onChange, value, placeholder, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
