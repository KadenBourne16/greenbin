'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const router = useRouter();
  const [recoveryMethod, setRecoveryMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name] || errors.submit) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.submit;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (recoveryMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[0-9\-\+\(\)\s]+$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setIsSuccess(true);
      setFormData({ email: '', phone: '' });
      
      // Optionally redirect after showing success message
      // setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      console.error('Recovery error:', error);
      setErrors({
        submit: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We'll send you a {recoveryMethod === 'email' ? 'link' : 'code'} to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setRecoveryMethod('email');
                  setErrors({});
                }}
                className={`py-2 px-4 text-sm font-medium ${
                  recoveryMethod === 'email'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecoveryMethod('phone');
                  setErrors({});
                }}
                className={`py-2 px-4 text-sm font-medium ${
                  recoveryMethod === 'phone'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Phone
              </button>
            </div>
          </div>

          {isSuccess ? (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {recoveryMethod === 'email'
                      ? 'We have sent a password reset link to your email address.'
                      : 'We have sent a verification code to your phone number.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {errors.submit && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="text-sm text-red-700">{errors.submit}</div>
                </div>
              )}

              <div>
                <label
                  htmlFor={recoveryMethod}
                  className="block text-sm font-medium text-gray-700"
                >
                  {recoveryMethod === 'email' ? 'Email address' : 'Phone number'} *
                </label>
                <div className="mt-1">
                  <input
                    id={recoveryMethod}
                    name={recoveryMethod}
                    type={recoveryMethod === 'email' ? 'email' : 'tel'}
                    autoComplete={recoveryMethod}
                    value={formData[recoveryMethod]}
                    onChange={handleChange}
                    placeholder={
                      recoveryMethod === 'email'
                        ? 'Enter your email address'
                        : 'Enter your phone number'
                    }
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors[recoveryMethod] ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  />
                  {errors[recoveryMethod] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[recoveryMethod]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? 'bg-green-400'
                      : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {isSubmitting
                    ? 'Sending...'
                    : `Send ${recoveryMethod === 'email' ? 'Reset Link' : 'Verification Code'}`}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <Link
              href="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}